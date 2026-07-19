// src/features/auth/hooks/useAuth.js

import { useCallback, useState } from 'react';
import authClient from '../../../shared/api/authClient.js';
import { useAuthStore } from '../../../shared/store/authStore.js';

const CLIENT_ONLY_ERROR = 'Esta app es solo para clientes';
const isClientRole = (role) => role === 'USER_ROLE' || role === 'CLIENT';

function extractError(err) {
  const data = err.response?.data;
  return (
    data?.message ||
    data?.detail ||
    (Array.isArray(data?.errors) ? data.errors.join(', ') : null) ||
    err.message ||
    'Ocurrió un error inesperado'
  );
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  const handleLogin = useCallback(
    async ({ emailOrUsername, password }) => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await authClient.post('/Auth/login', {
          emailOrUsername,
          password,
        });

        const role = data?.userDetails?.role;

        if (!isClientRole(role)) {
          setError(CLIENT_ONLY_ERROR);
          return { success: false, error: CLIENT_ONLY_ERROR };
        }

        const result = await login(data.token, data.userDetails, data.expiresAt);

        if (!result.success) {
          setError(result.error);
          return result;
        }

        return { success: true };
      } catch (err) {
        const message = extractError(err);
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [login],
  );

  const handleRegister = useCallback(async (formValues) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', formValues.name.trim());
      formData.append('surname', formValues.surname.trim());
      formData.append('username', formValues.username.trim());
      formData.append('email', formValues.email.trim().toLowerCase());
      formData.append('password', formValues.password);
      formData.append('phone', formValues.phone.replace(/\D/g, ''));
      formData.append('dpi', formValues.dpi.replace(/\D/g, ''));
      formData.append('address', formValues.address.trim());
      formData.append('job', formValues.job.trim());
      formData.append('income', String(Number(formValues.income)));

      const { data } = await authClient.post('/Auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return {
        success: true,
        emailVerificationRequired: Boolean(data?.emailVerificationRequired),
        message: data?.message || 'Registro exitoso',
      };
    } catch (err) {
      const message = extractError(err);
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setError(null);
    await logout();
  }, [logout]);

  return {
    handleLogin,
    handleRegister,
    loading,
    error,
    logout: handleLogout,
  };
}
