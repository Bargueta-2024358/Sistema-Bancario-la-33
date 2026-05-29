const repo = require('../repositories/transaction.repository');
const ReportError = require('../utils/ReportError');
const { mapTransaction } = require('../utils/mappers');

const VALID_TYPES = ['DEPOSIT', 'WITHDRAW', 'TRANSFER_IN', 'TRANSFER_OUT'];

const createTransaction = async (payload) => {
  const { userId, accountNumber, type, amount } = payload;

  if (!userId || !accountNumber || !type) {
    throw new ReportError('userId, accountNumber y type son requeridos');
  }
  if (!VALID_TYPES.includes(type)) {
    throw new ReportError(`type inválido. Valores: ${VALID_TYPES.join(', ')}`);
  }
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount < 0) {
    throw new ReportError('amount debe ser un número >= 0');
  }

  const row = await repo.insertTransaction({
    userId: String(userId),
    accountNumber: String(accountNumber),
    type,
    amount: numericAmount,
    targetAccountNumber: payload.targetAccountNumber,
    description: payload.description,
    reverted: payload.reverted,
    bankingTransactionId: payload.bankingTransactionId,
    createdAt: payload.createdAt,
  });

  return mapTransaction(row);
};

module.exports = { createTransaction, VALID_TYPES };
