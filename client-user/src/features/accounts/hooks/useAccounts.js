// src/features/accounts/hooks/useAccounts.js

import { useCallback, useState } from 'react';
import bankingClient from '../../../shared/api/bankingClient.js';

export function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await bankingClient.get('/my');
      const data = response.data.data || response.data;
      const list = Array.isArray(data) ? data : [];
      setAccounts(list);
      return list;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al cargar cuentas';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBalance = useCallback(async (accountNumber) => {
    setError(null);

    try {
      const response = await bankingClient.get(`/${accountNumber}/balance`);
      const data = response.data.data || response.data;
      return data.balance ?? data;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al consultar saldo';
      setError(message);
      return null;
    }
  }, []);

  const getStatement = useCallback(async (accountNumber, limit = 50) => {
    setError(null);

    try {
      const response = await bankingClient.get(`/${accountNumber}/transactions`, {
        params: { limit },
      });
      return response.data.data || response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al cargar movimientos';
      setError(message);
      return [];
    }
  }, []);

  const getLastMovements = useCallback(
    async (accountNumber) => {
      setError(null);

      try {
        const response = await bankingClient.get(`/${accountNumber}/last-movements`);
        return response.data.data || response.data;
      } catch (err) {
        if (err.response?.status === 403 || err.response?.status === 401) {
          const txs = await getStatement(accountNumber, 5);
          return Array.isArray(txs) ? txs : [];
        }

        const message = err.response?.data?.message || 'Error al cargar movimientos';
        setError(message);
        return [];
      }
    },
    [getStatement],
  );

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    getBalance,
    getStatement,
    getLastMovements,
  };
}
