// src/features/favorites/hooks/useFavorites.js

import { useCallback, useState } from 'react';
import bankingClient from '../../../shared/api/bankingClient.js';

// NOTA: Si GET/POST/DELETE /favorites devuelven 404, falta registrar esas rutas
// en banking-service (account.routes.js o favorites.routes).

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await bankingClient.get('/favorites');
      const data = response.data.data || response.data;
      const list = Array.isArray(data) ? data : [];
      setFavorites(list);
      return list;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al cargar favoritos';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addFavorite = useCallback(async ({ alias, accountNumber, accountType }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await bankingClient.post('/favorites', {
        alias: alias.trim(),
        accountNumber: accountNumber.trim(),
        accountType: accountType?.trim() || '',
      });

      const data = response.data.data || response.data;
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al guardar favorito';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFavorite = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await bankingClient.delete(`/favorites/${id}`);
      setFavorites((prev) => prev.filter((f) => String(f._id || f.id) !== String(id)));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Error al eliminar favorito';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    addFavorite,
    removeFavorite,
  };
}
