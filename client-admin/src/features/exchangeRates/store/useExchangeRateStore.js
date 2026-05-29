import { create } from 'zustand';

import {
  getExchangeRates,
  createExchangeRate,
  updateExchangeRate,
  activateExchangeRate,
  deactivateExchangeRate,
} from '../../../shared/api/admin';

export const useExchangeRateStore =
  create((set) => ({
    exchangeRates: [],
    loading: false,
    error: null,

    getExchangeRates:
      async () => {
        try {
          set({
            loading: true,
          });

          const res =
            await getExchangeRates();

          set({
            exchangeRates: res?.data ?? res?.exchangeRates ?? [],
            loading: false,
            error: null,
          });
        } catch (error) {
          const apiErrors = error.response?.data?.errors;
          const message = Array.isArray(apiErrors)
            ? apiErrors.map((e) => e.message).join(', ')
            : error.response?.data?.message || 'Error al obtener tasas de cambio';

          set({
            error: message,
            exchangeRates: [],
            loading: false,
          });
        }
      },

    createExchangeRate:
      async (payload) => {
        try {
          set({
            loading: true,
          });

          await createExchangeRate(
            payload
          );

          const res =
            await getExchangeRates();

          set({
            exchangeRates: res?.data ?? res?.exchangeRates ?? [],
            loading: false,
          });
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Error al crear tasa',
            loading: false,
          });

          throw error;
        }
      },

    updateExchangeRate:
      async (
        id,
        payload
      ) => {
        try {
          set({
            loading: true,
          });

          await updateExchangeRate(
            id,
            payload
          );

          const res =
            await getExchangeRates();

          set({
            exchangeRates: res?.data ?? res?.exchangeRates ?? [],
            loading: false,
          });
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Error al actualizar tasa',
            loading: false,
          });

          throw error;
        }
      },

    activateExchangeRate:
      async (id) => {
        await activateExchangeRate(
          id
        );

        const res =
          await getExchangeRates();

        set({
          exchangeRates: res?.data ?? res?.exchangeRates ?? [],
        });
      },

    deactivateExchangeRate:
      async (id) => {
        await deactivateExchangeRate(
          id
        );

        const res =
          await getExchangeRates();

        set({
          exchangeRates: res?.data ?? res?.exchangeRates ?? [],
        });
      },
  }));