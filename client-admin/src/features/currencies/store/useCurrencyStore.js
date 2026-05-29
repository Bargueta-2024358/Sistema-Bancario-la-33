import { create } from 'zustand';

import {
  getCurrencies,
  createCurrency,
  updateCurrency,
  activateCurrency,
  deactivateCurrency,
} from '../../../shared/api/admin';

const pickCurrency = (res) => res?.data ?? res;

export const useCurrencyStore = create((set, get) => ({
  currencies: [],
  loading: false,
  error: null,

  getCurrencies: async (params) => {
    try {
      set({ loading: true, error: null });

      const res = await getCurrencies(params);

      set({
        currencies: res.data ?? res.currencies ?? [],
        loading: false,
      });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.status === 429
          ? 'Demasiadas peticiones. Espera un momento e intenta de nuevo.'
          : 'Error obteniendo monedas');

      set({
        error: message,
        loading: false,
      });
    }
  },

  createCurrency: async (payload) => {
    try {
      const res = await createCurrency(payload);
      const created = pickCurrency(res);

      set({
        currencies: [created, ...get().currencies],
      });

      return created;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error creando moneda',
      });

      throw err;
    }
  },

  updateCurrency: async (id, payload) => {
    try {
      const res = await updateCurrency(id, payload);
      const updated = pickCurrency(res);

      set({
        currencies: get().currencies.map((c) => (c._id === id ? updated : c)),
        error: null,
      });

      return updated;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error actualizando moneda',
      });

      throw err;
    }
  },

  activateCurrency: async (id) => {
    try {
      const res = await activateCurrency(id);
      const updated = pickCurrency(res);

      set({
        currencies: get().currencies.map((c) => (c._id === id ? updated : c)),
        error: null,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error activando moneda',
      });

      throw err;
    }
  },

  deactivateCurrency: async (id) => {
    try {
      const res = await deactivateCurrency(id);
      const updated = pickCurrency(res);

      set({
        currencies: get().currencies.map((c) => (c._id === id ? updated : c)),
        error: null,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error desactivando moneda',
      });

      throw err;
    }
  },
}));
