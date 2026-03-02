import Currency from './currency.model.js';
import eventBus from '../events/eventBus.js';

export const fetchCurrencies = async ({
  page = 1,
  limit = 10,
  isActive = true,
}) => {
  const filter = { isActive };
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const currencies = await Currency.find(filter)
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber)
    .sort({ createdAt: -1 });

  const total = await Currency.countDocuments(filter);

  return {
    currencies,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalRecords: total,
      limit: limitNumber,
    },
  };
};

export const fetchCurrencyById = async (id) => {
  return Currency.findById(id);
};

export const createCurrencyRecord = async ({ currencyData }) => {
  const currency = new Currency(currencyData);
  await currency.save();

  eventBus.emit('currency.created', {
    id: currency._id,
    code: currency.code,
    name: currency.name,
    createdAt: currency.createdAt,
  });

  return currency;
};

export const updateCurrencyRecord = async ({ id, updateData }) => {
  const currency = await Currency.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (currency) {
    eventBus.emit('currency.updated', {
      id: currency._id,
      code: currency.code,
      name: currency.name,
      updatedAt: new Date(),
    });
  }

  return currency;
};

export const updateCurrencyStatus = async ({ id, isActive }) => {
  const currency = await Currency.findByIdAndUpdate(
    id,
    { isActive },
    { new: true }
  );

  if (currency && !isActive) {
    eventBus.emit('currency.deactivated', {
      id: currency._id,
      code: currency.code,
      deactivatedAt: new Date(),
    });
  }

  return currency;
};