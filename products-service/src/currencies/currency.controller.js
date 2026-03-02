import {
  fetchCurrencies,
  fetchCurrencyById,
  createCurrencyRecord,
  updateCurrencyRecord,
  updateCurrencyStatus,
} from './currency.service.js';
import { CURRENCY_CATALOG } from '../../utils/currency-catalog.js';

// Obtener monedas
export const getCurrencies = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive = true } = req.query;
    const { currencies, pagination } = await fetchCurrencies({
      page,
      limit,
      isActive,
    });

    res.status(200).json({ success: true, data: currencies, pagination });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener las monedas', error: error.message });
  }
};

// Obtener moneda por ID
export const getCurrencyById = async (req, res) => {
  try {
    const { id } = req.params;
    const currency = await fetchCurrencyById(id);

    if (!currency) return res.status(404).json({ success: false, message: 'Moneda no encontrada' });

    res.status(200).json({ success: true, data: currency });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener la moneda', error: error.message });
  }
};

// Crear moneda usando catálogo maestro
export const createCurrency = async (req, res) => {
  try {
    const code = req.body.code.toUpperCase();

    const catalogEntry = CURRENCY_CATALOG[code];
    if (!catalogEntry) {
      return res.status(400).json({ success: false, message: `Código de moneda inválido: ${code}` });
    }

    const currencyData = {
      code,
      name: catalogEntry.name,
      symbol: catalogEntry.symbol,
    };

    const currency = await createCurrencyRecord({ currencyData });

    res.status(201).json({ success: true, message: 'Moneda creada exitosamente', data: currency });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: `Ya existe una moneda con código ${req.body.code.toUpperCase()}` });
    }

    res.status(400).json({ success: false, message: 'Error al crear la moneda', error: error.message });
  }
};

// Actualizar moneda
export const updateCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};

    if (req.body.code) {
      const code = req.body.code.toUpperCase();
      const catalogEntry = CURRENCY_CATALOG[code];
      if (!catalogEntry) return res.status(400).json({ success: false, message: `Código de moneda inválido: ${code}` });

      updateData.code = code;
      updateData.name = catalogEntry.name;
      updateData.symbol = catalogEntry.symbol;
    }

    const currency = await updateCurrencyRecord({ id, updateData });

    if (!currency) return res.status(404).json({ success: false, message: 'Moneda no encontrada' });

    res.status(200).json({ success: true, message: 'Moneda actualizada exitosamente', data: currency });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: `Ya existe una moneda con código ${req.body.code.toUpperCase()}` });
    }

    res.status(400).json({ success: false, message: 'Error al actualizar la moneda', error: error.message });
  }
};

// Activar - Desactivar moneda
export const changeCurrencyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const isActive = req.url.includes('/activate');
    const action = isActive ? 'activada' : 'desactivada';

    const currency = await updateCurrencyStatus({ id, isActive });

    if (!currency) return res.status(404).json({ success: false, message: 'Moneda no encontrada' });

    res.status(200).json({ success: true, message: `Moneda ${action} exitosamente`, data: currency });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al cambiar el estado de la moneda', error: error.message });
  }
};