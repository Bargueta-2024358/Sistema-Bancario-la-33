import {
  fetchExchangeRates,
  fetchExchangeRateById,
  createExchangeRateRecord,
  updateExchangeRateRecord,
  updateExchangeRateStatus,
  convertCurrencyAmount,
} from './exchangeRate.service.js';

export const getExchangeRates = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive } = req.query;
    const filters = {};
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    const result = await fetchExchangeRates({ page, limit, ...filters });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener tasas', error: error.message });
  }
};

export const getExchangeRateById = async (req, res) => {
  try {
    const rate = await fetchExchangeRateById(req.params.id);
    if (!rate) {
      return res.status(404).json({ success: false, message: 'Tasa de cambio no encontrada' });
    }
    res.status(200).json({ success: true, data: rate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createExchangeRate = async (req, res) => {
  try {
    const rate = await createExchangeRateRecord({ rateData: req.body });
    res.status(201).json({ success: true, message: 'Tasa creada', data: rate });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateExchangeRate = async (req, res) => {
  try {
    const rate = await updateExchangeRateRecord({ id: req.params.id, updateData: req.body });
    if (!rate) {
      return res.status(404).json({ success: false, message: 'Tasa no encontrada' });
    }
    res.status(200).json({ success: true, message: 'Tasa actualizada', data: rate });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const changeExchangeRateStatus = async (req, res) => {
  try {
    const isActive = req.path.includes('/activate') && !req.path.includes('/deactivate');
    const rate = await updateExchangeRateStatus({ id: req.params.id, isActive });
    if (!rate) {
      return res.status(404).json({ success: false, message: 'Tasa no encontrada' });
    }
    res.status(200).json({
      success: true,
      message: `Tasa ${isActive ? 'activada' : 'desactivada'}`,
      data: rate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const convertCurrency = async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount, preferLocal } = req.query;
    const result = await convertCurrencyAmount({
      fromCurrency,
      toCurrency,
      amount,
      preferLocal: preferLocal === 'true',
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    const status = error.statusCode || 400;
    res.status(status).json({
      success: false,
      message: error.message,
      error: error.code || 'CONVERSION_ERROR',
    });
  }
};
