import { create } from 'zustand';

import {
  getAccountTypes,
  createAccountType,
  updateAccountType,
  activateAccountType,
  deactivateAccountType,
} from '../../../shared/api/admin';

export const useAccountTypeStore =
  create((set) => ({
    accountTypes: [],
    loading: false,
    error: null,

    getAccountTypes:
      async () => {
        try {
          set({
            loading: true,
          });

          const res =
            await getAccountTypes();

          set({
            accountTypes:
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

    createAccountType:
      async (payload) => {
        try {
          set({
            loading: true,
          });

          await createAccountType(
            payload
          );

          const res =
            await getAccountTypes();

          set({
            accountTypes:
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

    updateAccountType:
      async (
        id,
        payload
      ) => {
        try {
          set({
            loading: true,
          });

          await updateAccountType(
            id,
            payload
          );

          const res =
            await getAccountTypes();

          set({
            accountTypes:
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

    activateAccountType:
      async (id) => {
        await activateAccountType(
          id
        );

        const res =
          await getAccountTypes();

        set({
          accountTypes:
            res.data,
        });
      },

    deactivateAccountType:
      async (id) => {
        await deactivateAccountType(
          id
        );

        const res =
          await getAccountTypes();

        set({
          accountTypes:
            res.data,
        });
      },
  }));