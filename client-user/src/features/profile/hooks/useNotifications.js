// src/features/profile/hooks/useNotifications.js

import { useCallback, useState } from 'react';
import notificationsClient from '../../../shared/api/notificationsClient.js';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationsClient.get('/notifications/unread/count');
      const data = response.data.data || response.data;
      const count = data?.count ?? 0;
      setUnreadCount(count);
      return count;
    } catch (err) {
      setUnreadCount(0);
      return 0;
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await notificationsClient.get('/notifications', {
        params: { limit: 50 },
      });

      const payload = response.data.data || response.data;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(response.data?.notifications)
            ? response.data.notifications
            : [];

      setNotifications(list);
      return list;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al cargar notificaciones';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(
    async (id) => {
      setError(null);

      try {
        await notificationsClient.patch(`/notifications/${id}/read`);
        setNotifications((prev) =>
          prev.map((n) =>
            String(n._id || n.id) === String(id) ? { ...n, read: true } : n,
          ),
        );
        await fetchUnreadCount();
        return { success: true };
      } catch (err) {
        const message = err.response?.data?.message || 'No se pudo marcar como leída';
        setError(message);
        return { success: false, error: message };
      }
    },
    [fetchUnreadCount],
  );

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
  };
}
