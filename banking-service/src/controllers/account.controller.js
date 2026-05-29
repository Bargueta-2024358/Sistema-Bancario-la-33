const service = require('../services/account.service');

const getUserId = (req) => req.user.sub || req.user.id;

const ok = (res, data, status = 200) =>
  res.status(status).json({ success: true, data });

exports.createAccount = async (req, res, next) => {
  try {
    const { userId, accountTypeId, initialBalance } = req.body;
    const account = await service.createAccount({ userId, accountTypeId, initialBalance });
    ok(res, account, 201);
  } catch (error) {
    next(error);
  }
};

exports.getAllAccounts = async (req, res, next) => {
  try {
    ok(res, await service.getAllAccounts());
  } catch (error) {
    next(error);
  }
};

exports.getMyAccounts = async (req, res, next) => {
  try {
    ok(res, await service.getAccountsByUser(getUserId(req)));
  } catch (error) {
    next(error);
  }
};

exports.deactivateAccount = async (req, res, next) => {
  try {
    ok(res, await service.deactivateAccount(req.params.accountNumber));
  } catch (error) {
    next(error);
  }
};

exports.adminDeposit = async (req, res, next) => {
  try {
    const result = await service.adminDeposit(
      req.params.accountNumber,
      req.body.amount,
      getUserId(req)
    );
    ok(res, result);
  } catch (error) {
    next(error);
  }
};

exports.revertDeposit = async (req, res, next) => {
  try {
    ok(res, await service.revertTransaction(req.params.transactionId));
  } catch (error) {
    next(error);
  }
};

exports.revertTransaction = async (req, res, next) => {
  try {
    ok(res, await service.revertTransaction(req.params.transactionId));
  } catch (error) {
    next(error);
  }
};

exports.deposit = async (req, res, next) => {
  try {
    ok(res, await service.deposit(getUserId(req), req.params.accountNumber, req.body.amount));
  } catch (error) {
    next(error);
  }
};

exports.withdraw = async (req, res, next) => {
  try {
    ok(res, await service.withdraw(getUserId(req), req.params.accountNumber, req.body.amount));
  } catch (error) {
    next(error);
  }
};

exports.transfer = async (req, res, next) => {
  try {
    const { toAccountNumber, amount, description, accountType } = req.body;
    ok(
      res,
      await service.transfer(
        getUserId(req),
        req.params.accountNumber,
        toAccountNumber,
        amount,
        description,
        accountType
      )
    );
  } catch (error) {
    next(error);
  }
};

exports.getBalance = async (req, res, next) => {
  try {
    ok(res, { balance: await service.getBalance(getUserId(req), req.params.accountNumber) });
  } catch (error) {
    next(error);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const limit = req.query.limit;
    ok(res, await service.getTransactions(getUserId(req), req.params.accountNumber, limit));
  } catch (error) {
    next(error);
  }
};

exports.getLastMovements = async (req, res, next) => {
  try {
    ok(res, await service.getLastMovements(req.params.accountNumber, 5));
  } catch (error) {
    next(error);
  }
};

exports.getTopAccounts = async (req, res, next) => {
  try {
    ok(res, await service.getTopAccountsByMovements(10));
  } catch (error) {
    next(error);
  }
};

exports.getUserBalance = async (req, res, next) => {
  try {
    ok(res, await service.getBalanceByUserId(req.params.userId));
  } catch (error) {
    next(error);
  }
};

exports.addFavorite = async (req, res, next) => {
  try {
    ok(res, await service.addFavorite(getUserId(req), req.body), 201);
  } catch (error) {
    next(error);
  }
};

exports.getFavorites = async (req, res, next) => {
  try {
    ok(res, await service.getFavorites(getUserId(req)));
  } catch (error) {
    next(error);
  }
};

exports.deleteFavorite = async (req, res, next) => {
  try {
    ok(res, await service.deleteFavorite(getUserId(req), req.params.favoriteId));
  } catch (error) {
    next(error);
  }
};
