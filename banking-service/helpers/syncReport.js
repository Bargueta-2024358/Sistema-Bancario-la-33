const syncTransaction = async (payload) => {
  const reportUrl = process.env.REPORT_SERVICE_URL || 'http://localhost:3022';
  const serviceKey = process.env.INTERNAL_SERVICE_KEY || 'Banco33InternalKey2026';

  try {
    await fetch(`${reportUrl}/api/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-service-key': serviceKey,
      },
      body: JSON.stringify({
        userId: payload.userId,
        accountNumber: payload.accountNumber,
        type: payload.type,
        amount: payload.amount,
        targetAccountNumber: payload.targetAccountNumber || null,
        description: payload.description || null,
        reverted: payload.reverted || false,
        bankingTransactionId: payload.bankingTransactionId || null,
        createdAt: payload.createdAt || null,
      }),
    });
  } catch (_err) {
  }
};

module.exports = { syncTransaction };
