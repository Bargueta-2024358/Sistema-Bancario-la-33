import { axiosBanking } from './api';

export const getAllAccounts = async () => {
  const { data } = await axiosBanking.get('/');
  return data.data || data;
};

export const getMyAccounts = async () => {
  const { data } = await axiosBanking.get('/my');
  return data.data || data;
};

export const createAccount = async (payload) => {
  const { data } = await axiosBanking.post('/', payload);
  return data.data || data;
};

export const adminDeposit = async (accountNumber, amount) => {
  const { data } = await axiosBanking.post(`/${accountNumber}/admin-deposit`, { amount });
  return data.data || data;
};

export const revertDeposit = async (transactionId) => {
  const { data } = await axiosBanking.post(`/transactions/${transactionId}/revert`);
  return data.data || data;
};

export const getLastMovements = async (accountNumber) => {
  const { data } = await axiosBanking.get(`/${accountNumber}/last-movements`);
  return data.data || data;
};

export const getTopMovements = async () => {
  const { data } = await axiosBanking.get('/top-movements');
  return data.data || data;
};

export const getUserBalance = async (userId) => {
  const { data } = await axiosBanking.get(`/user/${userId}/balance`);
  return data.data || data;
};

export const getBalance = async (accountNumber) => {
  const { data } = await axiosBanking.get(`/${accountNumber}/balance`);
  return data.data || data;
};

export const getTransactions = async (accountNumber, limit = 50) => {
  const { data } = await axiosBanking.get(`/${accountNumber}/transactions`, { params: { limit } });
  return data.data || data;
};

export const transfer = async (fromAccountNumber, payload) => {
  const { data } = await axiosBanking.post(`/${fromAccountNumber}/transfer`, payload);
  return data.data || data;
};

export const deposit = async (accountNumber, amount) => {
  const { data } = await axiosBanking.post(`/${accountNumber}/deposit`, { amount });
  return data.data || data;
};

export const withdraw = async (accountNumber, amount) => {
  const { data } = await axiosBanking.post(`/${accountNumber}/withdraw`, { amount });
  return data.data || data;
};

