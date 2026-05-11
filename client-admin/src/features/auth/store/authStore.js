import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginRequest, register as registerRequest } from '../../../shared/api';
import { showError } from '../../../shared/utils/toast.js';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      expiresAt: null,
      loading: false,
      error: null,
      isLoadingAuth: true,
      isAuthenticated: false,

      checkAuth: () => {
        const token = get().token;
        const role = get().user?.role;
        const isAdmin = role === 'ADMIN_ROLE';

        set({
          isLoadingAuth: false,
          isAuthenticated: Boolean(token) && isAdmin,
        });

        if (token && !isAdmin) {
          set({
            user: null,
            token: null,
            refreshToken: null,
            expiresAt: null,
            isAuthenticated: false,
            error: 'No tienes permisos para acceder a esta aplicación',
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
        });
      },

      login: async ({ emailOrUsername, password }) => {
        try {
          set({ loading: true, error: null });

          const { data } = await loginRequest({ emailOrUsername, password });

          console.log('LOGIN DATA:', data);

          const role = data?.userDetails?.role;

          if (role !== 'ADMIN_ROLE') {
            const message = 'No tienes permisos para acceder a esta aplicación';

            set({
              user: null,
              token: null,
              refreshToken: null,
              expiresAt: null,
              isAuthenticated: false,
              isLoadingAuth: false,
              error: message,
              loading: false,
            });

            showError(message);
            return { success: false, error: message };
          }

          // ✅ AQUÍ ESTÁ EL FIX REAL
          set({
            user: data.userDetails,
            token: data.token,           // 🔥 CAMBIADO (antes accessToken)
            refreshToken: null,          // no viene en tu API
            expiresAt: data.expiresAt,   // 🔥 CAMBIADO (antes expiresIn)
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Error al iniciar sesión';

          set({
            error: message,
            loading: false,
          });

          return { success: false, error: message };
        }
      },

      register: async (formData) => {
        try {
          set({ loading: true, error: null });

          const { data } = await registerRequest(formData);

          set({ loading: false });

          return {
            success: true,
            emailVerificationRequired: data?.emailVerificationRequired,
            data,
          };
        } catch (err) {
          const message = err.response?.data?.message || 'Error al registrar usuario';

          set({
            error: message,
            loading: false,
          });

          return { success: false, error: message };
        }
      },
    }),
    { name: 'auth-KS-IN6AV' }
  )
);