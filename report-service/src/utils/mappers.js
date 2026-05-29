const mapTransaction = (row) => ({
  id: row.id,
  userId: row.user_id,
  accountNumber: row.account_number,
  type: row.type,
  amount: Number(row.amount),
  targetAccountNumber: row.target_account_number,
  description: row.description,
  reverted: row.reverted,
  bankingTransactionId: row.banking_transaction_id,
  createdAt: row.created_at,
});

module.exports = { mapTransaction };
