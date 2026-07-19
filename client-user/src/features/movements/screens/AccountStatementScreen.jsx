// src/features/movements/screens/AccountStatementScreen.jsx

import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../../shared/components/common/Button.jsx';
import { Input } from '../../../shared/components/common/Input.jsx';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme.js';
import { formatQuetzales } from '../../../shared/utils/formatCurrency.js';
import { formatTransactionType } from '../../../shared/utils/transactionLabels.js';
import { useAccounts } from '../../accounts/hooks/useAccounts.js';
import { ScreenHeader } from '../../shared/ScreenHeader.jsx';
import { SelectField } from '../../shared/SelectField.jsx';
import { useMovements } from '../hooks/useMovements.js';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AccountStatementScreen({ navigation, route }) {
  const initialAccount = route.params?.accountNumber || '';
  const { accounts, fetchAccounts } = useAccounts();
  const { movements, statement, loading, error, fetchAccountStatement } = useMovements();
  const [accountNumber, setAccountNumber] = useState(initialAccount);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    if (!accountNumber && accounts[0]) {
      setAccountNumber(accounts[0].accountNumber);
    }
  }, [accounts, accountNumber]);

  const applyFilters = useCallback(async () => {
    if (!accountNumber) return;

    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;

    await fetchAccountStatement(accountNumber, params);
  }, [accountNumber, from, to, fetchAccountStatement]);

  useEffect(() => {
    if (accountNumber) {
      fetchAccountStatement(accountNumber);
    }
  }, [accountNumber, fetchAccountStatement]);

  const accountOptions = accounts.map((a) => ({
    label: a.accountNumber,
    value: a.accountNumber,
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Estado de cuenta"
        subtitle="Detalle y filtros por fecha"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.filters}>
        <SelectField
          label="Cuenta"
          value={accountNumber}
          options={accountOptions}
          onChange={setAccountNumber}
        />

        <View style={styles.dateRow}>
          <Input
            label="Desde (AAAA-MM-DD)"
            placeholder="2026-01-01"
            value={from}
            onChangeText={setFrom}
            style={styles.dateInput}
          />
          <Input
            label="Hasta (AAAA-MM-DD)"
            placeholder="2026-12-31"
            value={to}
            onChangeText={setTo}
            style={styles.dateInput}
          />
        </View>

        <Button loading={loading} onPress={applyFilters}>
          Aplicar filtros
        </Button>
      </View>

      {statement ? (
        <Card style={styles.summary}>
          <Text style={styles.summaryText}>
            Saldo inicial: {formatQuetzales(statement.openingBalance)}
          </Text>
          <Text style={styles.summaryText}>
            Saldo final: {formatQuetzales(statement.closingBalance)}
          </Text>
          <Text style={styles.summaryMuted}>
            {statement.summary?.transactionCount || 0} movimientos en el periodo
          </Text>
        </Card>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading && movements.length === 0 ? (
        <LoadingSpinner message="Cargando estado de cuenta..." />
      ) : (
        <FlatList
          data={movements}
          keyExtractor={(item, index) => String(item.id || `${item.date}-${index}`)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState icon="description" title="Sin movimientos" description="Ajusta el rango de fechas." />
          }
          renderItem={({ item }) => {
            const isCredit = item.direction === 'credit';
            const color = isCredit ? COLORS.success : COLORS.error;

            return (
              <Card style={styles.card}>
                <View style={styles.row}>
                  <MaterialIcons
                    name={isCredit ? 'arrow-downward' : 'arrow-upward'}
                    size={20}
                    color={color}
                  />
                  <View style={styles.info}>
                    <Text style={styles.type}>{formatTransactionType(item.type)}</Text>
                    <Text style={styles.date}>{formatDate(item.date)}</Text>
                    {item.description ? (
                      <Text style={styles.desc}>{item.description}</Text>
                    ) : null}
                  </View>
                  <Text style={[styles.amount, { color }]}>{formatQuetzales(item.amount)}</Text>
                </View>
              </Card>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filters: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  dateRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  dateInput: {
    flex: 1,
  },
  summary: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  summaryText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  summaryMuted: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
  },
  list: {
    padding: SPACING.lg,
    gap: SPACING.md,
    paddingBottom: SPACING.xxxl,
  },
  card: {
    padding: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  type: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  date: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
  },
  desc: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textBody,
  },
  amount: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  error: {
    color: COLORS.error,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
});
