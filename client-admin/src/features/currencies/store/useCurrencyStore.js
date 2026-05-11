import { create } from 'zustand';

import {
  getCurrencies,
  createCurrency,
  updateCurrency,
  activateCurrency,
  deactivateCurrency,
} from '../../../shared/api/admin';

export const useCurrencyStore = create((set, get) => ({
  currencies: [],
  loading: false,
  error: null,

  getCurrencies: async () => {
    try {
      set({ loading: true, error: null });

      const res = await getCurrencies();

      set({
        currencies: res.data || [],
        loading: false,
      });
    } catch (err) {
      set({
        error: 'Error obteniendo monedas',
        loading: false,
      });
    }
  },

  createCurrency: async (payload) => {
    try {
      const res = await createCurrency(payload);

      set({
        currencies: [res.data, ...get().currencies],
      });
    } catch (err) {
      set({
        error: 'Error creando moneda',
      });

      throw err;
    }
  },

  updateCurrency: async (id, payload) => {
    try {
      const res = await updateCurrency(id, payload);

      set({
        currencies: get().currencies.map((c) =>
          c._id === id ? res.data : c
        ),
      });
    } catch (err) {
      set({
        error: 'Error actualizando moneda',
      });

      throw err;
    }
  },

 activateCurrency: async (id) => {
      try {
        const res =
          await activateCurrency(id);

        set({
          currencies:
            get().currencies.map((c) =>
              c._id === id
                ? res.data
                : c
            ),
        });
      } catch (err) {
        set({
          error:
            'Error activando moneda',
        });

        throw err;
      }
    },

    deactivateCurrency: async (
      id
    ) => {
      try {
        const res =
          await deactivateCurrency(id);

        set({
          currencies:
            get().currencies.map((c) =>
              c._id === id
                ? res.data
                : c
            ),
        });
      } catch (err) {
        set({
          error:
            'Error desactivando moneda',
        });

        throw err;
      }
    },
}));