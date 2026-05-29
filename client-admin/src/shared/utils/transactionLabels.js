const TRANSACTION_TYPE_LABELS = {
  DEPOSIT: 'Depósitos',
  WITHDRAW: 'Retiros',
  TRANSFER_OUT: 'Transferencias',
  TRANSFER_IN: 'Transferencias',
  TRANSFER: 'Transferencias',
};

export const formatTransactionType = (type) => {
  if (!type) return '—';
  const key = String(type).toUpperCase();
  return TRANSACTION_TYPE_LABELS[key] || type;
};
