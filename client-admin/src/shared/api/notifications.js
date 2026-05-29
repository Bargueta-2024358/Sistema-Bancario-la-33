import { axiosNotifications } from './api';

export const getNotifications = async (params = {}) => {
  const { data } = await axiosNotifications.get('/notifications', { params });
  return data;
};

export const getUnreadCount = async () => {
  const { data } = await axiosNotifications.get('/notifications/unread/count');
  return data.data?.count ?? 0;
};

export const markAsRead = async (id) => {
  const { data } = await axiosNotifications.patch(`/notifications/${id}/read`);
  return data;
};
