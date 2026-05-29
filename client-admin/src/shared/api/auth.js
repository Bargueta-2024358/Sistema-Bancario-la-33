import { axiosAuth } from './api';

export const login = async (data) => {
  return await axiosAuth.post('/Auth/login', data);
};

export const registerPublic = async (formData) => {
  return await axiosAuth.post('/Auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getAllUsers = async () => {
  const { data } = await axiosAuth.get('/Users');
  const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  return { users: list };
};

export const createUser = async (formData) => {
  return await axiosAuth.post('/Users', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const verifyEmail = async (token) => {
  const { data } = await axiosAuth.post('/Auth/verify-email', { token });
  return data;
};

export const resendVerificationEmail = async (email) => {
  const { data } = await axiosAuth.post('/Auth/resend-verification', { email });
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await axiosAuth.post('/Auth/forgot-password', { email });
  return data;
};

export const resetPassword = async ({ token, newPassword }) => {
  const { data } = await axiosAuth.post('/Auth/reset-password', { token, newPassword });
  return data;
};

export const getProfile = async () => {
  const { data } = await axiosAuth.get('/Auth/profile');
  return data.data || data;
};

export const deleteUser = async (id) => {
  return await axiosAuth.delete(`/Users/${id}`);
};

export const updateProfile = async (payload) => {
  const { data } = await axiosAuth.put('/Auth/profile', payload);
  return data.data || data;
};

export const updateProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  const { data } = await axiosAuth.put('/Auth/profile/picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data || data;
};

export const updateUser = async (id, payload) => {
  const { data } = await axiosAuth.put(`/Users/${id}`, payload);
  return data.data || data;
};

export const updateUserRole = async (id, role) => {
  const dbRole = role === 'ADMIN' || role === 'ADMIN_ROLE' ? 'ADMIN_ROLE' : 'USER_ROLE';
  const { data } = await axiosAuth.put(`/Users/${id}/role`, { role: dbRole });
  return data.data || data;
};
