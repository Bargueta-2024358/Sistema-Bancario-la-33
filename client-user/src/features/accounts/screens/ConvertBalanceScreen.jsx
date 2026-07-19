// src/features/accounts/screens/ConvertBalanceScreen.jsx

import { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import productsClient from '../../../shared/api/productsClient.js';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme.js';
import { formatQuetzales } from '../../../shared/utils/formatCurrency.js';
import { ScreenHeader } from '../../shared/ScreenHeader.jsx';
import { SelectField } from '../../shared/SelectField.jsx';

export default function ConvertBalanceScreen({ navigation, route }) {
  const { accountNumber, balance = 0 } = route.params || {};
  const [currencies, setCurrencies] = useState([]);
  const [toCurrency, setToCurrency] = useState('');
  const [conversion, setConversion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState(null);

  const loadCurrencies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await productsClient.get('/currencies', { params: { limit: 100 } });
      const payload = response.data.data || response.data;
      const list = Array.isArray(payload) ? payload : payload?.data || [];
      const active = list.filter((c) => c.isActive !== false);
      setCurrencies(active);

      const first = active.find((c) => (c.code || c.currencyCode) !== 'GTQ');
      if (first) {
        setToCurrency(first.code || first.currencyCode);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar monedas');
    } finally {
      setLoading(false);
    }
  }, []);

  const convertBalance = useCallback(async () => {
    if (!toCurrency) return;

    setConverting(true);
    setError(null);

    try {
      const response = await productsClient.get('/currencies/convert', {
        params: {
          fromCurrency: 'GTQ',
          toCurrency,
          amount: Number(balance),
        },
      });

      setConversion(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al convertir saldo');
      setConversion(null);
    } finally {
      setConverting(false);
    }
  }, [balance, toCurrency]);

  useEffect(() => {
    loadCurrencies();
  }, [loadCurrencies]);

  useEffect(() => {
    if (toCurrency && balance > 0) {
      convertBalance();
    }
  }, [toCurrency, balance, convertBalance]);

  const currencyOptions = currencies
    .map((c) => c.code || c.currencyCode)
    .filter((code) => code && code !== 'GTQ')
    .map((code) => ({ label: code, value: code }));

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingSpinner message="Cargando monedas..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Convertir saldo"
        subtitle={accountNumber ? `Cuenta ${accountNumber}` : undefined}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.label}>Saldo en quetzales (GTQ)</Text>
          <Text style={styles.amount}>{formatQuetzales(balance)}</Text>
        </Card>

        <SelectField
          label="Moneda destino"
          value={toCurrency}
          options={currencyOptions}
          onChange={setToCurrency}
          placeholder="Selecciona moneda"
          error={error && !conversion ? error : undefined}
        />

        {converting ? (
          <LoadingSpinner message="Calculando conversión..." size="small" />
        ) : null}

        {conversion ? (
          <Card style={styles.result}>
            <Text style={styles.resultLabel}>Saldo convertido</Text>
            <Text style={styles.resultValue}>
              {Number(conversion.convertedAmount ?? conversion.amount ?? 0).toLocaleString('es-GT', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              {conversion.toCurrency || toCurrency}
            </Text>
            {conversion.rate != null ? (
              <Text style={styles.rate}>
                Tasa: {conversion.rate} ({conversion.source || 'local'})
              </Text>
            ) : null}
          </Card>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  card: {
    gap: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  amount: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  result: {
    gap: SPACING.sm,
    backgroundColor: COLORS.surfaceHover,
  },
  resultLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textBody,
  },
  resultValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.success,
  },
  rate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
  },
});
