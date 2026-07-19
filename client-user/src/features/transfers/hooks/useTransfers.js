// src/features/transfers/hooks/useTransfers.js

import { useCallback, useState } from 'react';
import bankingClient from '../../../shared/api/bankingClient.js';

const MAX_PER_TRANSFER = 2000;

export function useTransfers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const transfer = useCallback(async (fromAccountNumber, payload) => {
    const amount = Number(payload.amount);

    if (amount > MAX_PER_TRANSFER) {
      const message = 'Máximo Q2,000 por transferencia';
      setError(message);
      return { success: false, error: message };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await bankingClient.post(`/${fromAccountNumber}/transfer`, {
        toAccountNumber: payload.toAccountNumber.trim(),
        amount,
        description: payload.description?.trim() || '',
        accountType: payload.accountType?.trim() || '',
      });

      const data = response.data.data || response.data;
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Error en la transferencia';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    transfer,
  };
}
