// src/shared/utils/formatCurrency.js

export function formatQuetzales(value) {
  const num = Number(value);
  if (Number.isNaN(num)) {
    return 'Q 0.00';
  }

  return `Q ${num.toLocaleString('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
