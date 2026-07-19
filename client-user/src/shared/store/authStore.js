// src/shared/store/authStore.js

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'banco33-client-token';
const isClientRole = (role) => role === 'USER_ROLE' || role === 'CLIENT';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      expiresAt: null,
      _hasHydrated: false,

      checkAuth: () => {
        const { token, expiresAt, user } = get();

        if (token && expiresAt && new Date(expiresAt) < new Date()) {
          get().logout();
          return;
        }

        const clientUser = user && isClientRole(user.role);
        set({
          isAuthenticated: Boolean(token && clientUser),
        });
      },

      login: async (token, user, expiresAt) => {
        if (!isClientRole(user?.role)) {
          await get().logout();
          return {
            success: false,
            error: 'Esta aplicación es solo para clientes',
          };
        }

        await SecureStore.setItemAsync(TOKEN_KEY, token);
        set({
          token,
          user,
          expiresAt,
          isAuthenticated: true,
        });

        return { success: true };
      },

      logout: async () => {
        try {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
        } catch {
          // SecureStore puede fallar si no hay token guardado
        }

        set({
          token: null,
          user: null,
          expiresAt: null,
          isAuthenticated: false,
        });
      },

      setToken: async (token) => {
        if (token) {
          await SecureStore.setItemAsync(TOKEN_KEY, token);
        } else {
          try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
          } catch {
            // sin token previo
          }
        }

        set({ token });
        get().checkAuth();
      },

      updateUser: (user) => {
        const isAuth = isClientRole(user?.role) && Boolean(get().token);
        set({
          user,
          isAuthenticated: isAuth,
        });
      },
    }),
    {
      name: 'auth-client-user',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => async (state, error) => {
        if (!error) {
          try {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            useAuthStore.setState({ token });
            useAuthStore.getState().checkAuth();
          } catch {
            // sin token en SecureStore
          }
        }

        useAuthStore.setState({ _hasHydrated: true });
      },
    },
  ),
);
