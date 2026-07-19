// src/features/profile/hooks/useProfile.js

import { useCallback, useState } from 'react';
import authClient from '../../../shared/api/authClient.js';
import { useAuthStore } from '../../../shared/store/authStore.js';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const updateUser = useAuthStore((s) => s.updateUser);
  const storeUser = useAuthStore((s) => s.user);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authClient.get('/Auth/profile');
      const data = response.data.data || response.data;
      setProfile(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al cargar perfil';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProfile = useCallback(
    async ({ name, address, job, income }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await authClient.put('/Auth/profile', {
          name: name.trim(),
          address: address.trim(),
          job: job.trim(),
          income: Number(income) || 0,
        });

        const updated = response.data.data || response.data;
        setProfile(updated);

        if (storeUser) {
          updateUser({
            ...storeUser,
            name: updated.name ?? storeUser.name,
            address: updated.address,
            job: updated.job,
            income: updated.income,
            profilePicture: updated.profilePicture ?? storeUser.profilePicture,
          });
        }

        return { success: true, data: updated };
      } catch (err) {
        const message = err.response?.data?.message || 'No se pudo guardar el perfil';
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [storeUser, updateUser],
  );

  return {
    profile,
    loading,
    error,
    fetchProfile,
    saveProfile,
  };
}
