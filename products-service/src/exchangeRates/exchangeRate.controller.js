import {
  fetchExchangeRates,
  fetchExchangeRateById,
  createExchangeRateRecord,
  updateExchangeRateRecord,
  updateExchangeRateStatus,
} from './exchangeRate.service.js';

// Obtener tasas de cambio
export const getExchangeRates = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive = true } = req.query;
    const { exchangeRates, pagination } = await fetchExchangeRates({
      page,
      limit,
      isActive,
    });

    res.status(200).json({
      success: true,
      data: exchangeRates,
      pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las tasas de cambio',
      error: error.message,
    });
  }
};

// Obtener tasa por ID
export const getExchangeRateById = async (req, res) => {
  try {
    const { id } = req.params;
    const rate = await fetchExchangeRateById(id);

    if (!rate) {
      return res.status(404).json({
        success: false,
        message: 'Tasa de cambio no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      data: rate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la tasa de cambio',
      error: error.message,
    });
  }
};

// Crear tasa de cambio
export const createExchangeRate = async (req, res) => {
  try {
    const rate = await createExchangeRateRecord({
      rateData: req.body,
    });

    res.status(201).json({
      success: true,
      message: 'Tasa de cambio creada exitosamente',
      data: rate,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear la tasa de cambio',
      error: error.message,
    });
  }
};

// Actualizar tasa
export const updateExchangeRate = async (req, res) => {
  try {
    const { id } = req.params;
    const rate = await updateExchangeRateRecord({
      id,
      updateData: req.body,
    });

    if (!rate) {
      return res.status(404).json({
        success: false,
        message: 'Tasa de cambio no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tasa de cambio actualizada exitosamente',
      data: rate,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar la tasa de cambio',
      error: error.message,
    });
  }
};

// Activar - Desactivar tasa
export const changeExchangeRateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const isActive = req.url.includes('/activate');
    const action = isActive ? 'activada' : 'desactivada';

    const rate = await updateExchangeRateStatus({ id, isActive });

    if (!rate) {
      return res.status(404).json({
        success: false,
        message: 'Tasa de cambio no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      message: `Tasa de cambio ${action} exitosamente`,
      data: rate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado de la tasa de cambio',
      error: error.message,
    });
  }
};

// Convertir monto entre monedas
export const convertCurrency = async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.query;

    const convertedAmount = await convertCurrencyAmount({
      fromCurrency,
      toCurrency,
      amount: Number(amount),
    });

    res.status(200).json({
      success: true,
      data: {
        fromCurrency,
        toCurrency,
        amount,
        convertedAmount,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al convertir la moneda',
      error: error.message,
    });
  }
};