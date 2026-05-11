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
            exchangeRates:
              res.data,
            loading: false,
          });
        } catch (error) {
          set({
            error:
              error.response?.data
                ?.message,
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
            exchangeRates:
              res.data,
            loading: false,
          });
        } catch (error) {
          set({
            error:
              error.response?.data
                ?.message,
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
            exchangeRates:
              res.data,
            loading: false,
          });
        } catch (error) {
          set({
            error:
              error.response?.data
                ?.message,
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
          exchangeRates:
            res.data,
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
          exchangeRates:
            res.data,
        });
      },
  }));