import ExchangeRate from './exchangeRate.model.js';
import eventBus from '../events/eventBus.js';

export const fetchExchangeRates = async ({ page = 1, limit = 10, isActive = true }) => {
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const filter = { isActive };

  const rates = await ExchangeRate.find(filter)
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber)
    .sort({ createdAt: -1 })
    .populate('fromCurrency', 'code name symbol')
    .populate('toCurrency', 'code name symbol');

  const total = await ExchangeRate.countDocuments(filter);

  return {
    exchangeRates: rates,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalRecords: total,
      limit: limitNumber,
    },
  };
};

export const fetchExchangeRateById = async (id) => {
  return ExchangeRate.findById(id);
};

export const createExchangeRateRecord = async ({ rateData }) => {
  const existingRate = await ExchangeRate.findOne({
    fromCurrency: rateData.fromCurrency,
    toCurrency: rateData.toCurrency,
    isActive: true,
  });

  if (existingRate) {
    throw new Error(
      `Ya existe una tasa de cambio activa de "${rateData.fromCurrency}" a "${rateData.toCurrency}"`
    );
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

  return rate;
};

export const updateExchangeRateRecord = async ({ id, updateData }) => {
  const rate = await ExchangeRate.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (rate) {
    eventBus.emit('exchangeRate.updated', {
      id: rate._id,
      fromCurrency: rate.fromCurrency,
      toCurrency: rate.toCurrency,
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
  );

  if (rate && !isActive) {
    eventBus.emit('exchangeRate.deactivated', {
      id: rate._id,
      fromCurrency: rate.fromCurrency,
      toCurrency: rate.toCurrency,
      deactivatedAt: new Date(),
    });
  }

  return rate;
};
