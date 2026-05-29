import Currency from '../currencies/currency.model.js';
import ExchangeRate from '../exchangeRates/exchangeRate.model.js';
import ProductsError from '../utils/ProductsError.js';
import { convertWithExternalApi } from './externalCurrencyApi.js';

const normalizeCode = (value) => String(value || '').trim().toUpperCase();

export const resolveCurrency = async (codeOrId) => {
  if (!codeOrId) throw new ProductsError('Moneda requerida');

  const value = String(codeOrId).trim();

  let currency = null;
  if (value.length <= 5) {
    currency = await Currency.findOne({ code: normalizeCode(value), isActive: true });
  }
  if (!currency) {
    currency = await Currency.findOne({ _id: value, isActive: true });
  }

  if (!currency) {
    throw new ProductsError(`Moneda "${codeOrId}" no encontrada`, 404);
  }

  return currency;
};

export const convertCurrencyAmount = async ({ fromCurrency, toCurrency, amount, preferLocal = false }) => {
  const fromCode = normalizeCode(fromCurrency);
  const toCode = normalizeCode(toCurrency);
  const numericAmount = Number(amount);

  if (!fromCode || !toCode) {
    throw new ProductsError('fromCurrency y toCurrency son requeridos');
  }
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new ProductsError('El monto debe ser mayor a 0');
  }

  if (fromCode === toCode) {
    return {
      fromCurrency: fromCode,
      toCurrency: toCode,
      amount: numericAmount,
      convertedAmount: Number(numericAmount.toFixed(2)),
      rate: 1,
      source: 'same-currency',
    };
  }

  if (!preferLocal) {
    try {
      return await convertWithExternalApi(fromCode, toCode, numericAmount);
    } catch (externalError) {
      console.warn(`[currency] API externa falló: ${externalError.message}. Usando BD local.`);
    }
  }

  const fromDoc = await resolveCurrency(fromCode);
  const toDoc = await resolveCurrency(toCode);

  const localRate = await ExchangeRate.findOne({
    fromCurrency: fromDoc._id,
    toCurrency: toDoc._id,
    isActive: true,
  });

  if (!localRate) {
    throw new ProductsError(
      `No hay tasa activa de ${fromCode} a ${toCode} y la API externa no está disponible`,
      503,
      'RATE_UNAVAILABLE'
    );
  }

  const convertedAmount = Number((numericAmount * localRate.rate).toFixed(2));

  return {
    fromCurrency: fromCode,
    toCurrency: toCode,
    amount: numericAmount,
    convertedAmount,
    rate: localRate.rate,
    source: 'local-database',
    exchangeRateId: localRate._id,
  };
};
