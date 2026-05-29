/**
 * API externa de divisas (Frankfurter - sin API key, uso académico)
 * Docs: https://www.frankfurter.app/docs/
 */
const DEFAULT_BASE = 'https://api.frankfurter.app';

const buildUrl = (from, to) => {
  const base = process.env.EXTERNAL_CURRENCY_API_URL || DEFAULT_BASE;
  const params = new URLSearchParams({ from: from.toUpperCase() });
  if (to) params.set('to', to.toUpperCase());
  return `${base}/latest?${params.toString()}`;
};

export const fetchExternalRates = async (from = 'USD', to = null) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.EXTERNAL_API_TIMEOUT_MS || 8000));

  try {
    const response = await fetch(buildUrl(from, to), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`API externa respondió HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      base: data.base,
      date: data.date,
      rates: data.rates || {},
      provider: 'frankfurter.app',
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Timeout al consultar API externa de divisas');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export const convertWithExternalApi = async (from, to, amount) => {
  const fromCode = from.toUpperCase();
  const toCode = to.toUpperCase();
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error('Monto inválido');
  }

  if (fromCode === toCode) {
    return {
      fromCurrency: fromCode,
      toCurrency: toCode,
      amount: numericAmount,
      convertedAmount: Number(numericAmount.toFixed(2)),
      rate: 1,
      source: 'same-currency',
      provider: 'frankfurter.app',
    };
  }

  const data = await fetchExternalRates(fromCode, toCode);
  const rate = data.rates?.[toCode];

  if (!rate) {
    throw new Error(`Tasa no disponible en API externa para ${fromCode} → ${toCode}`);
  }

  const convertedAmount = Number((numericAmount * rate).toFixed(2));

  return {
    fromCurrency: fromCode,
    toCurrency: toCode,
    amount: numericAmount,
    convertedAmount,
    rate,
    rateDate: data.date,
    source: 'external-api',
    provider: data.provider,
  };
};
