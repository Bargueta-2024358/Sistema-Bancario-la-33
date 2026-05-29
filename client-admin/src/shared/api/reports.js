import { axiosReports } from './api';

export const getHistory = async (userId, params = {}) => {
  const { data } = await axiosReports.get(`/reports/history/${userId}`, { params });
  return data.data || data;
};

export const getFinancialReport = async (userId, params = {}) => {
  const { data } = await axiosReports.get(`/reports/financial/${userId}`, { params });
  return data.data || data;
};

export const getAccountStatement = async (accountNumber, params = {}) => {
  const { data } = await axiosReports.get(`/reports/account-statement/${accountNumber}`, { params });
  return data.data || data;
};

export const getGlobalReport = async () => {
  const { data } = await axiosReports.get('/reports/global');
  return data.data || data;
};
