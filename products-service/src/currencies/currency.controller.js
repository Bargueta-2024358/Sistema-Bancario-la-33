import {
  fetchCurrencies,
  fetchCurrencyById,
  createCurrencyRecord,
  updateCurrencyRecord,
  updateCurrencyStatus,
} from './currency.service.js';
import { CURRENCY_CATALOG } from '../../utils/currency-catalog.js';
import { convertCurrencyAmount } from '../services/currencyConversion.service.js';
import { fetchExternalRates } from '../services/externalCurrencyApi.js';

export const getCurrencies = async (req, res) => {
  try {
    const { page = 1, limit = 50, isActive } = req.query;
    const result = await fetchCurrencies({
      page,
      limit,
      isActive: isActive === undefined ? undefined : isActive === 'true',
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCurrencyById = async (req, res) => {
  try {
    const currency = await fetchCurrencyById(req.params.id);
    if (!currency) {
      return res.status(404).json({ success: false, message: 'Moneda no encontrada' });
    }
    res.status(200).json({ success: true, data: currency });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getExternalRates = async (req, res) => {
  try {
    const { from = 'USD', to } = req.query;
    const data = await fetchExternalRates(from, to || null);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'No se pudo obtener tasas de la API externa',
      error: error.message,
    });
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
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
      error: error.code || 'CONVERSION_ERROR',
    });
  }
};

export const createCurrency = async (req, res) => {
  try {
    const code = String(req.body.code || '').trim().toUpperCase();
    const catalogEntry = CURRENCY_CATALOG[code];

    if (!catalogEntry) {
      return res.status(400).json({
        success: false,
        message: `Código no válido. Usa uno del catálogo: ${Object.keys(CURRENCY_CATALOG).join(', ')}`,
      });
    }

    const currencyData = {
      code,
      name: req.body.name?.trim() || catalogEntry.name,
      symbol: req.body.symbol?.trim() || catalogEntry.symbol,
    };

    const currency = await createCurrencyRecord({ currencyData });
    res.status(201).json({ success: true, message: 'Moneda creada', data: currency });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateCurrency = async (req, res) => {
  try {
    const code = String(req.body.code || '').trim().toUpperCase();
    const catalogEntry = code ? CURRENCY_CATALOG[code] : null;

    const updateData = { ...req.body };
    if (code) updateData.code = code;

    if (catalogEntry) {
      if (!updateData.name?.trim()) updateData.name = catalogEntry.name;
      if (!updateData.symbol?.trim()) updateData.symbol = catalogEntry.symbol;
    }

    const currency = await updateCurrencyRecord({ id: req.params.id, updateData });
    if (!currency) {
      return res.status(404).json({ success: false, message: 'Moneda no encontrada' });
    }
    res.status(200).json({ success: true, message: 'Moneda actualizada', data: currency });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const changeCurrencyStatus = async (req, res) => {
  try {
    const isActive = req.path.includes('/activate');
    const currency = await updateCurrencyStatus({ id: req.params.id, isActive });
    if (!currency) {
      return res.status(404).json({ success: false, message: 'Moneda no encontrada' });
    }
    res.status(200).json({
      success: true,
      message: `Moneda ${isActive ? 'activada' : 'desactivada'}`,
      data: currency,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
