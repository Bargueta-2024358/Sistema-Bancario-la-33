// src/shared/utils/transactionLabels.js

const LABELS = {
  DEPOSIT: 'Depósito',
  WITHDRAW: 'Retiro',
  TRANSFER_IN: 'Transferencia recibida',
  TRANSFER_OUT: 'Transferencia enviada',
  TRANSFER: 'Transferencia',
};

export function formatTransactionType(type) {
  if (!type) return 'Movimiento';
  return LABELS[String(type).toUpperCase()] || type;
}

export function isCreditType(type) {
  const key = String(type || '').toUpperCase();
  return key === 'DEPOSIT' || key === 'TRANSFER_IN';
}
