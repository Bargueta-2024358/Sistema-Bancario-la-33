const CREDIT_TYPES = new Set(['DEPOSIT', 'TRANSFER_IN']);

const signedAmount = (type, amount) => {
  const value = Number(amount);
  return CREDIT_TYPES.has(type) ? value : -value;
};

module.exports = { CREDIT_TYPES, signedAmount };
