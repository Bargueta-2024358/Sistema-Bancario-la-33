import ExchangeRate from './exchangeRate.model.js';
import eventBus from '../events/eventBus.js';
import { convertCurrencyAmount } from '../services/currencyConversion.service.js';

export { convertCurrencyAmount };

export const fetchExchangeRates = async ({ page = 1, limit = 10, isActive }) => {
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const filters = {};

  if (isActive !== undefined) {
    filters.isActive = isActive;
  }

  const exchangeRates = await ExchangeRate.find(filters)
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber)
    .sort({ createdAt: -1 })
    .populate('fromCurrency', 'code name symbol')
    .populate('toCurrency', 'code name symbol');

  const total = await ExchangeRate.countDocuments(filters);

  return {
    exchangeRates,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber) || 1,
      totalRecords: total,
      limit: limitNumber,
    },
  };
};

export const fetchExchangeRateById = async (id) => {
  return ExchangeRate.findById(id)
    .populate('fromCurrency', 'code name symbol')
    .populate('toCurrency', 'code name symbol');
};

export const createExchangeRateRecord = async ({ rateData }) => {
  const existingRate = await ExchangeRate.findOne({
    fromCurrency: rateData.fromCurrency,
    toCurrency: rateData.toCurrency,
    isActive: true,
  });

  if (existingRate) {
    throw new Error('Ya existe una tasa de cambio activa para este par de monedas');
  }

  const rate = new ExchangeRate(rateData);
  await rate.save();

  eventBus.emit('exchangeRate.created', {
    id: rate._id,
    fromCurrency: rate.fromCurrency,
    toCurrency: rate.toCurrency,
    rate: rate.rate,
    createdAt: rate.createdAt,
  });

  return rate.populate(['fromCurrency', 'toCurrency']);
};

export const updateExchangeRateRecord = async ({ id, updateData }) => {
  const rate = await ExchangeRate.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('fromCurrency', 'toCurrency');

  if (rate) {
    eventBus.emit('exchangeRate.updated', {
      id: rate._id,
      rate: rate.rate,
      updatedAt: new Date(),
    });
  }

  return rate;
};

export const updateExchangeRateStatus = async ({ id, isActive }) => {
  const rate = await ExchangeRate.findByIdAndUpdate(
    id,
    { isActive },
    { new: true }
  ).populate('fromCurrency', 'toCurrency');

  if (rate && !isActive) {
    eventBus.emit('exchangeRate.deactivated', { id: rate._id });
  }

  return rate;
};
