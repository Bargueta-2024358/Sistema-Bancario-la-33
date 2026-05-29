import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginRequest, registerPublic } from '../../../shared/api/auth';
import { showError } from '../../../shared/utils/toast.js';

const isAdminRole = (role) => role === 'ADMIN_ROLE' || role === 'ADMIN';
const isClientRole = (role) => role === 'USER_ROLE' || role === 'CLIENT';

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

      isAdmin: () => isAdminRole(get().user?.role),
      isClient: () => isClientRole(get().user?.role),

      checkAuth: () => {
        const { token, expiresAt, user } = get();

        if (token && expiresAt && new Date(expiresAt) < new Date()) {
          set({
            user: null,
            token: null,
            refreshToken: null,
            expiresAt: null,
            isAuthenticated: false,
            isLoadingAuth: false,
            error: 'Sesión expirada',
          });
          return;
        }

        set({
          isLoadingAuth: false,
          isAuthenticated: Boolean(token && user),
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
          error: null,
        });
      },

      login: async ({ emailOrUsername, password }) => {
        try {
          set({ loading: true, error: null });
          const { data } = await loginRequest({ emailOrUsername, password });
          const role = data?.userDetails?.role;

          if (!isAdminRole(role) && !isClientRole(role)) {
            const message = 'Rol de usuario no reconocido';
            set({ loading: false, error: message });
            showError(message);
            return { success: false, error: message };
          }

          set({
            user: data.userDetails,
            token: data.token,
            refreshToken: data.refreshToken || null,
            expiresAt: data.expiresAt,
            isAuthenticated: true,
            loading: false,
          });
          return { success: true, role };
        } catch (err) {
          const message = err.response?.data?.message || 'Error al iniciar sesión';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      register: async (formData) => {
        try {
          set({ loading: true, error: null });
          const { data } = await registerPublic(formData);
          set({ loading: false });
          return {
            success: true,
            emailVerificationRequired: data?.emailVerificationRequired,
            data,
          };
        } catch (err) {
          const data = err.response?.data;
          const message =
            data?.message ||
            data?.detail ||
            (Array.isArray(data?.errors) ? data.errors.join(', ') : null) ||
            'Error al registrar usuario';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
    }),
    { name: 'auth-banco33' }
  )
);
