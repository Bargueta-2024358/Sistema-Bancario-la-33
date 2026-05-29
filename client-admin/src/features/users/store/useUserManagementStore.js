import { create } from 'zustand';
import { getAllUsers as getAllUsersRequest } from '../../../shared/api';

const normalizeUsers = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const useUserManagementStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,
  filters: {},

  setFilters: (filters) => set({ filters }),

  setUsers: (users) => set({ users: normalizeUsers(users) }),

  getAllUsers: async (apiFn = getAllUsersRequest, options = {}) => {
    const { force = false } = options;
    const state = get();

    if (state.loading) return;
    if (!force && state.users.length > 0) return;

    set({ loading: true, error: null });

    try {
      const fetcher = typeof apiFn === 'function' ? apiFn : getAllUsersRequest;
      const response = await fetcher();
      const users = normalizeUsers(response);

      set({
        users,
        loading: false,
        error: null,
      });
    } catch (err) {
      const status = err.response?.status;
      let message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        'Error al obtener los usuarios';

      if (status === 401 || status === 403) {
        message = 'Sesión inválida o sin permisos de administrador. Cierra sesión e ingresa de nuevo con ADMINB.';
      }

      set({
        users: [],
        error: message,
        loading: false,
      });
    }
  },

  refreshUsers: async () => {
    await get().getAllUsers(getAllUsersRequest, { force: true });
  },
}));
