// src/shared/constants/endpoints.js

export const ENDPOINTS = {
  AUTH: process.env.EXPO_PUBLIC_AUTH_URL || 'http://localhost:5210/api/v1',
  BANKING: process.env.EXPO_PUBLIC_BANKING_URL || 'http://localhost:3024/api/accounts',
  PRODUCTS: process.env.EXPO_PUBLIC_PRODUCTS_URL || 'http://localhost:3001/BancoLa33/v1',
  REPORTS: process.env.EXPO_PUBLIC_REPORTS_URL || 'http://localhost:3022/api',
  NOTIFICATIONS: process.env.EXPO_PUBLIC_NOTIFICATIONS_URL || 'http://localhost:3023/api',
};
