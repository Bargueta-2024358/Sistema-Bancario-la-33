import Currency from '../currencies/currency.model.js';
import AccountType from '../accountTypes/accountType.model.js';
import Product from '../products/product.model.js';
import ExchangeRate from '../exchangeRates/exchangeRate.model.js';
import { CURRENCY_CATALOG } from '../../utils/currency-catalog.js';

const ACCOUNT_TYPES = [
  { name: 'Ahorro', interestRate: 3.5, description: 'Cuenta de ahorro con interés mensual' },
  { name: 'Monetaria', interestRate: 0.5, description: 'Cuenta corriente para operaciones diarias' },
  { name: 'Crédito', interestRate: 12, description: 'Línea de crédito revolvente' },
  { name: 'Inversión', interestRate: 6.25, description: 'Cuenta de inversión a plazo' },
];

const PRODUCTS = [
  { name: 'Depósito a plazo 90 días', interestRate: 5.5, currencyCode: 'GTQ', description: 'Plazo fijo 90 días en quetzales' },
  { name: 'Cuenta premium USD', interestRate: 2.1, currencyCode: 'USD', description: 'Producto en dólares' },
  { name: 'Fondo euro', interestRate: 1.8, currencyCode: 'EUR', description: 'Producto denominado en euros' },
];

const LOCAL_RATES = [
  { from: 'USD', to: 'GTQ', rate: 7.85 },
  { from: 'EUR', to: 'GTQ', rate: 8.55 },
  { from: 'GTQ', to: 'USD', rate: 0.127 },
];

export const seedProductsData = async () => {
  if (process.env.SEED_DATA === 'false') return;

  for (const [code, meta] of Object.entries(CURRENCY_CATALOG)) {
    await Currency.findOneAndUpdate(
      { code },
      { code, name: meta.name, symbol: meta.symbol, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  for (const [code, meta] of Object.entries(CURRENCY_CATALOG)) {
    await Currency.updateMany(
      { code },
      { $set: { name: meta.name, symbol: meta.symbol } }
    );
  }

  for (const type of ACCOUNT_TYPES) {
    await AccountType.findOneAndUpdate(
      { name: type.name },
      { ...type, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const currencyMap = {};
  const currencies = await Currency.find({ isActive: true });
  currencies.forEach((c) => {
    currencyMap[c.code] = c._id;
  });

  for (const item of PRODUCTS) {
    const currencyId = currencyMap[item.currencyCode];
    if (!currencyId) continue;
    await Product.findOneAndUpdate(
      { name: item.name, currency: currencyId },
      {
        name: item.name,
        description: item.description,
        interestRate: item.interestRate,
        currency: currencyId,
        isActive: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  for (const pair of LOCAL_RATES) {
    const fromId = currencyMap[pair.from];
    const toId = currencyMap[pair.to];
    if (!fromId || !toId) continue;
    await ExchangeRate.findOneAndUpdate(
      { fromCurrency: fromId, toCurrency: toId, isActive: true },
      { fromCurrency: fromId, toCurrency: toId, rate: pair.rate, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log('[seed] Monedas, tipos de cuenta, productos y tasas locales listos');
};
