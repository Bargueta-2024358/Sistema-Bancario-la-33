// src/features/movements/hooks/useMovements.js

import { useCallback, useState } from 'react';
import reportsClient from '../../../shared/api/reportsClient.js';
import bankingClient from '../../../shared/api/bankingClient.js';
import { isCreditType } from '../../../shared/utils/transactionLabels.js';

function mapMovement(row) {
  const type = String(row.type || '').toUpperCase();

  return {
    id: row.id || row._id || row.bankingTransactionId,
    type,
    amount: Number(row.amount),
    date: row.createdAt || row.date,
    description: row.description || row.targetAccountNumber || '',
    direction: isCreditType(type) ? 'credit' : 'debit',
  };
}

async function fetchBankingTransactions(accountNumber, limit = 50) {
  const response = await bankingClient.get(`/${accountNumber}/transactions`, {
    params: { limit },
  });
  const data = response.data.data || response.data;
  return Array.isArray(data) ? data.map(mapMovement) : [];
}

export function useMovements() {
  const [movements, setMovements] = useState([]);
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccountStatement = useCallback(async (accountNumber, params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await reportsClient.get(`/reports/account-statement/${accountNumber}`, {
        params,
      });

      const data = response.data.data || response.data;
      let mapped = (data.movements || []).map(mapMovement);

      if (mapped.length === 0) {
        mapped = await fetchBankingTransactions(accountNumber, params.limit || 50);
      }

      setStatement(data);
      setMovements(mapped);

      return { ...data, movements: mapped };
    } catch (err) {
      try {
        const mapped = await fetchBankingTransactions(accountNumber, params.limit || 50);
        setMovements(mapped);
        setStatement({ accountNumber, movements: mapped });
        return { accountNumber, movements: mapped };
      } catch (bankingErr) {
        const message =
          bankingErr.response?.data?.message ||
          err.response?.data?.message ||
          'Error al cargar movimientos';
        setError(message);
        setMovements([]);
        setStatement(null);
        return null;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    movements,
    statement,
    loading,
    error,
    fetchAccountStatement,
  };
}
