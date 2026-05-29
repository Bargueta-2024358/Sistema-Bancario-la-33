const Account = require('../models/account.model');
const Transaction = require('../models/transaction.model');
const Favorite = require('../models/favorite.model');
const generateAccountNumber = require('../../helpers/generateAccountNumber');
const { syncTransaction } = require('../../helpers/syncReport');
const { validateAccountType, getAccountTypesMap } = require('../../helpers/productsClient');
const { notifyTransfer, notifyDeposit } = require('../../helpers/notifyClient');
const BankingError = require('../utils/BankingError');
const {
  MAX_TRANSFER_AMOUNT,
  MAX_DAILY_TRANSFER_AMOUNT,
  REVERT_DEPOSIT_WINDOW_MS,
  TRANSACTION_TYPES,
  ALLOWED_TRANSFER_ACCOUNT_TYPES,
} = require('../constants/banking.constants');

class AccountService {
  _uid(userId) {
    return String(userId);
  }

  _validateAmount(amount) {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      throw new BankingError('Monto inválido');
    }
    return value;
  }

  _normalizeAccountType(value) {
    const clean = String(value || '').trim();
    if (!clean) return '';
    const match = ALLOWED_TRANSFER_ACCOUNT_TYPES.find(
      (type) => type.localeCompare(clean, 'es', { sensitivity: 'base' }) === 0
    );
    return match || clean;
  }

  async _attachAccountTypeName(accounts) {
    const list = accounts.map((a) => (typeof a.toObject === 'function' ? a.toObject() : a));
    const typeMap = await getAccountTypesMap();
    return list.map((account) => ({
      ...account,
      accountTypeName: account.accountTypeId
        ? typeMap[String(account.accountTypeId)] || null
        : null,
    }));
  }

  async _getDailyTransferTotal(userId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const accounts = await Account.find({ userId: this._uid(userId) }).select('accountNumber');
    const accountNumbers = accounts.map((a) => a.accountNumber);

    const result = await Transaction.aggregate([
      {
        $match: {
          accountNumber: { $in: accountNumbers },
          type: { $in: [TRANSACTION_TYPES.TRANSFER_OUT, TRANSACTION_TYPES.TRANSFER_IN] },
          reverted: { $ne: true },
          createdAt: { $gte: startOfDay },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return result[0]?.total || 0;
  }

  async _recordTransaction(data, session = null) {
    const docs = await Transaction.create([data], session ? { session } : undefined);
    const tx = docs[0];
    syncTransaction({
      userId: tx.userId,
      accountNumber: tx.accountNumber,
      type: tx.type,
      amount: tx.amount,
      targetAccountNumber: tx.targetAccountNumber,
      description: tx.description,
      accountType: tx.accountType,
      reverted: tx.reverted,
      bankingTransactionId: String(tx._id),
      createdAt: tx.createdAt,
    });
    return tx;
  }

  async createAccount({ userId, accountTypeId, initialBalance = 0 }) {
    if (!userId) throw new BankingError('userId es requerido');

    if (accountTypeId) {
      const check = await validateAccountType(accountTypeId);
      if (!check.valid) {
        throw new BankingError(check.message, 400);
      }
    }

    let accountNumber;
    let exists = true;
    let attempts = 0;

    while (exists && attempts < 10) {
      accountNumber = generateAccountNumber();
      exists = await Account.exists({ accountNumber });
      attempts += 1;
    }

    if (exists) throw new BankingError('No se pudo generar número de cuenta único', 500);

    const balance = Math.max(0, Number(initialBalance) || 0);

    const account = await Account.create({
      userId: this._uid(userId),
      accountNumber,
      accountTypeId: accountTypeId || null,
      balance,
    });

    if (balance > 0) {
      await this._recordTransaction({
        userId: account.userId,
        accountNumber: account.accountNumber,
        type: TRANSACTION_TYPES.DEPOSIT,
        amount: balance,
        description: 'Saldo inicial al crear cuenta',
        performedByUserId: userId,
      });
    }

    return account;
  }

  async getAllAccounts() {
    const accounts = await Account.find({ isActive: true }).sort({ updatedAt: -1 });
    return this._attachAccountTypeName(accounts);
  }

  async getAccountsByUser(userId) {
    const accounts = await Account.find({ userId: this._uid(userId), isActive: true }).sort({
      createdAt: -1,
    });
    return this._attachAccountTypeName(accounts);
  }

  async getAccountForUser(userId, accountNumber) {
    const account = await Account.findOne({ accountNumber, userId: this._uid(userId) });
    if (!account) throw new BankingError('Cuenta no encontrada', 404);
    return account;
  }

  async deactivateAccount(accountNumber) {
    const account = await Account.findOne({ accountNumber });
    if (!account) throw new BankingError('Cuenta no encontrada', 404);
    account.isActive = false;
    await account.save();
    return account;
  }

  async adminDeposit(accountNumber, amount, adminUserId) {
    amount = this._validateAmount(amount);

    const account = await Account.findOne({ accountNumber });
    if (!account) throw new BankingError('Cuenta no encontrada', 404);
    if (!account.isActive) throw new BankingError('Cuenta desactivada');

    account.balance += amount;
    await account.save();

    const tx = await this._recordTransaction({
      userId: account.userId,
      accountNumber,
      type: TRANSACTION_TYPES.DEPOSIT,
      amount,
      description: 'Depósito administrativo',
      performedByUserId: adminUserId,
    });
    notifyDeposit({
      userId: account.userId,
      accountNumber,
      amount,
      source: 'ADMIN',
    }).catch(() => {});

    return { account, transaction: tx };
  }

  async revertDeposit(transactionId) {
    return this.revertTransaction(transactionId);
  }

  async revertTransaction(transactionId) {
    const tx = await Transaction.findById(transactionId);
    if (!tx) throw new BankingError('Transacción no encontrada', 404);
    if (tx.reverted) throw new BankingError('Movimiento ya revertido');

    const elapsed = Date.now() - new Date(tx.createdAt).getTime();
    if (elapsed > REVERT_DEPOSIT_WINDOW_MS) {
      throw new BankingError('Solo se puede revertir dentro de 1 minuto');
    }

    const markReverted = async (transaction) => {
      transaction.reverted = true;
      transaction.revertedAt = new Date();
      await transaction.save();
    };

    if (tx.type === TRANSACTION_TYPES.DEPOSIT) {
      const account = await Account.findOne({ accountNumber: tx.accountNumber });
      if (!account) throw new BankingError('Cuenta no encontrada', 404);
      if (account.balance < tx.amount) throw new BankingError('Saldo insuficiente para revertir');
      account.balance -= tx.amount;
      await account.save();
      await markReverted(tx);
      return { account, transaction: tx };
    }

    if (tx.type === TRANSACTION_TYPES.WITHDRAW) {
      const account = await Account.findOne({ accountNumber: tx.accountNumber });
      if (!account) throw new BankingError('Cuenta no encontrada', 404);
      account.balance += tx.amount;
      await account.save();
      await markReverted(tx);
      return { account, transaction: tx };
    }

    const isTransferType =
      tx.type === TRANSACTION_TYPES.TRANSFER_OUT || tx.type === TRANSACTION_TYPES.TRANSFER_IN;

    if (isTransferType) {
      const fromAccountNumber =
        tx.type === TRANSACTION_TYPES.TRANSFER_OUT ? tx.accountNumber : tx.targetAccountNumber;
      const toAccountNumber =
        tx.type === TRANSACTION_TYPES.TRANSFER_OUT ? tx.targetAccountNumber : tx.accountNumber;

      const fromAccount = await Account.findOne({ accountNumber: fromAccountNumber });
      const toAccount = await Account.findOne({ accountNumber: toAccountNumber });

      if (!fromAccount || !toAccount) {
        throw new BankingError('Cuentas de transferencia no encontradas', 404);
      }

      if (toAccount.balance < tx.amount) {
        throw new BankingError('Saldo insuficiente para revertir transferencia');
      }

      fromAccount.balance += tx.amount;
      toAccount.balance -= tx.amount;
      await fromAccount.save();
      await toAccount.save();

      const counterpartType =
        tx.type === TRANSACTION_TYPES.TRANSFER_OUT
          ? TRANSACTION_TYPES.TRANSFER_IN
          : TRANSACTION_TYPES.TRANSFER_OUT;

      const counterpart = await Transaction.findOne({
        _id: { $ne: tx._id },
        type: counterpartType,
        accountNumber: tx.targetAccountNumber,
        targetAccountNumber: tx.accountNumber,
        amount: tx.amount,
        reverted: { $ne: true },
        createdAt: {
          $gte: new Date(new Date(tx.createdAt).getTime() - 120000),
          $lte: new Date(new Date(tx.createdAt).getTime() + 120000),
        },
      }).sort({ createdAt: -1 });

      await markReverted(tx);
      if (counterpart) {
        await markReverted(counterpart);
      }

      return { fromAccount, toAccount, transaction: tx, counterpart };
    }

    throw new BankingError('Tipo de movimiento no reversible');
  }

  async deposit(userId, accountNumber, amount) {
    amount = this._validateAmount(amount);
    const account = await this.getAccountForUser(userId, accountNumber);
    if (!account.isActive) throw new BankingError('Cuenta desactivada');

    account.balance += amount;
    await account.save();

    await this._recordTransaction({
      userId: account.userId,
      accountNumber,
      type: TRANSACTION_TYPES.DEPOSIT,
      amount,
      description: 'Depósito',
      performedByUserId: userId,
    });
    notifyDeposit({
      userId: account.userId,
      accountNumber,
      amount,
      source: 'SELF',
    }).catch(() => {});

    return account;
  }

  async withdraw(userId, accountNumber, amount) {
    amount = this._validateAmount(amount);
    const account = await this.getAccountForUser(userId, accountNumber);
    if (!account.isActive) throw new BankingError('Cuenta desactivada');
    if (account.balance < amount) throw new BankingError('Fondos insuficientes');

    account.balance -= amount;
    await account.save();

    await this._recordTransaction({
      userId: account.userId,
      accountNumber,
      type: TRANSACTION_TYPES.WITHDRAW,
      amount,
      description: 'Retiro',
      performedByUserId: userId,
    });

    return account;
  }

  async transfer(userId, fromAccountNumber, toAccountNumber, amount, description = '', accountType = '') {
    amount = this._validateAmount(amount);
    const cleanDescription = String(description || '').trim();
    const cleanAccountType = this._normalizeAccountType(accountType);

    if (!cleanAccountType) {
      throw new BankingError('El tipo de cuenta es requerido', 400);
    }
    if (!ALLOWED_TRANSFER_ACCOUNT_TYPES.includes(cleanAccountType)) {
      throw new BankingError(
        `Tipo de cuenta inválido. Debe ser: ${ALLOWED_TRANSFER_ACCOUNT_TYPES.join(', ')}`,
        400
      );
    }

    if (amount > MAX_TRANSFER_AMOUNT) {
      throw new BankingError(`Máximo Q${MAX_TRANSFER_AMOUNT} por transferencia`);
    }

    const dailyTotal = await this._getDailyTransferTotal(userId);
    if (dailyTotal + amount > MAX_DAILY_TRANSFER_AMOUNT) {
      throw new BankingError(`Máximo Q${MAX_DAILY_TRANSFER_AMOUNT} diarios en transferencias`);
    }

    if (fromAccountNumber === toAccountNumber) {
      throw new BankingError('No puede transferir a la misma cuenta');
    }

    const fromAccount = await Account.findOne({
      accountNumber: fromAccountNumber,
      userId: this._uid(userId),
    });

    if (!fromAccount) throw new BankingError('Cuenta origen no encontrada', 404);
    if (!fromAccount.isActive) throw new BankingError('Cuenta origen desactivada');
    if (fromAccount.balance < amount) throw new BankingError('Fondos insuficientes');

    const toAccount = await Account.findOne({
      accountNumber: toAccountNumber,
      isActive: true,
    });

    if (!toAccount) throw new BankingError('Cuenta destino no encontrada', 404);

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    await fromAccount.save();
    await toAccount.save();

    const transferTxs = await Transaction.create([
      {
        userId: fromAccount.userId,
        accountNumber: fromAccountNumber,
        type: TRANSACTION_TYPES.TRANSFER_OUT,
        amount,
        targetAccountNumber: toAccountNumber,
        description: cleanDescription || `Transferencia a ${toAccountNumber}`,
        accountType: cleanAccountType,
        performedByUserId: this._uid(userId),
      },
      {
        userId: toAccount.userId,
        accountNumber: toAccountNumber,
        type: TRANSACTION_TYPES.TRANSFER_IN,
        amount,
        targetAccountNumber: fromAccountNumber,
        description: cleanDescription || `Transferencia desde ${fromAccountNumber}`,
        accountType: cleanAccountType,
        performedByUserId: this._uid(userId),
      },
    ]);

    transferTxs.forEach((tx) => {
      syncTransaction({
        userId: tx.userId,
        accountNumber: tx.accountNumber,
        type: tx.type,
        amount: tx.amount,
        targetAccountNumber: tx.targetAccountNumber,
        description: tx.description,
        accountType: tx.accountType,
        bankingTransactionId: String(tx._id),
        createdAt: tx.createdAt,
      });
    });

    notifyTransfer({
      userId: fromAccount.userId,
      fromAccountNumber,
      toAccountNumber,
      amount,
      direction: 'OUT',
      description: cleanDescription,
      accountType: cleanAccountType,
    }).catch(() => {});
    notifyTransfer({
      userId: toAccount.userId,
      fromAccountNumber,
      toAccountNumber,
      amount,
      direction: 'IN',
      description: cleanDescription,
      accountType: cleanAccountType,
    }).catch(() => {});

    return { fromAccount, toAccount, amount };
  }

  async getBalance(userId, accountNumber) {
    const account = await this.getAccountForUser(userId, accountNumber);
    return account.balance;
  }

  async getTransactions(userId, accountNumber, limit = 50) {
    await this.getAccountForUser(userId, accountNumber);
    return Transaction.find({ accountNumber, reverted: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit) || 50, 200));
  }

  async getLastMovements(accountNumber, limit = 5) {
    return Transaction.find({ accountNumber, reverted: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async getTopAccountsByMovements(limit = 10) {
    return Transaction.aggregate([
      { $match: { reverted: { $ne: true } } },
      { $group: { _id: '$accountNumber', movementCount: { $sum: 1 } } },
      { $sort: { movementCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'accounts',
          localField: '_id',
          foreignField: 'accountNumber',
          as: 'account',
        },
      },
      { $unwind: { path: '$account', preserveNullAndEmptyArrays: true } },
    ]);
  }

  async getBalanceByUserId(userId) {
    const accounts = await Account.find({ userId: this._uid(userId), isActive: true });
    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
    return { userId, accounts, totalBalance };
  }

  async addFavorite(userId, { alias, accountNumber, accountHolderName }) {
    const target = await Account.findOne({ accountNumber, isActive: true });
    if (!target) throw new BankingError('La cuenta favorita no existe', 404);

    return Favorite.create({
      userId: this._uid(userId),
      alias,
      accountNumber,
      accountHolderName: accountHolderName || '',
    });
  }

  async getFavorites(userId) {
    return Favorite.find({ userId: this._uid(userId) }).sort({ createdAt: -1 });
  }

  async deleteFavorite(userId, favoriteId) {
    const fav = await Favorite.findOne({ _id: favoriteId, userId: this._uid(userId) });
    if (!fav) throw new BankingError('Favorito no encontrado', 404);
    await fav.deleteOne();
    return fav;
  }
}

module.exports = new AccountService();
