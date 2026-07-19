// src/features/movements/screens/MovementsScreen.jsx

import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
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

function movementIcon(type) {
  const key = String(type || '').toUpperCase();
  if (key === 'DEPOSIT' || key === 'TRANSFER_IN') return 'arrow-downward';
  return 'arrow-upward';
}

export default function MovementsScreen({ navigation }) {
  const { accounts, fetchAccounts } = useAccounts();
  const { movements, loading, error, fetchAccountStatement } = useMovements();
  const [selectedAccount, setSelectedAccount] = useState('');

  useEffect(() => {
    (async () => {
      const list = await fetchAccounts();
      if (list?.[0]) {
        setSelectedAccount(list[0].accountNumber);
      }
    })();
  }, [fetchAccounts]);

  const loadMovements = useCallback(async () => {
    if (!selectedAccount) return;
    await fetchAccountStatement(selectedAccount);
  }, [selectedAccount, fetchAccountStatement]);

  useEffect(() => {
    loadMovements();
  }, [loadMovements]);

  const accountOptions = accounts.map((a) => ({
    label: a.accountNumber,
    value: a.accountNumber,
  }));

  if (loading && movements.length === 0 && !selectedAccount) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingSpinner message="Cargando movimientos..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Movimientos"
        subtitle="Historial por cuenta"
      />

      <View style={styles.filters}>
        <SelectField
          label="Cuenta"
          value={selectedAccount}
          options={accountOptions}
          onChange={setSelectedAccount}
          placeholder="Selecciona cuenta"
        />

        <Pressable
          style={styles.statementLink}
          onPress={() =>
            navigation.navigate('AccountStatement', { accountNumber: selectedAccount })
          }
        >
          <Text style={styles.statementText}>Ver estado de cuenta con filtros</Text>
          <MaterialIcons name="chevron-right" size={20} color={COLORS.primaryDark} />
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={movements}
        keyExtractor={(item, index) => String(item.id || `${item.date}-${index}`)}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadMovements}
            tintColor={COLORS.primaryDark}
            colors={[COLORS.primaryDark]}
          />
        }
        ListEmptyComponent={
          <EmptyState icon="history" title="Sin movimientos" description="No hay registros para esta cuenta." />
        }
        renderItem={({ item }) => {
          const isCredit = item.direction === 'credit';
          const color = isCredit ? COLORS.success : COLORS.error;

          return (
            <Card style={styles.card}>
              <View style={styles.row}>
                <View style={[styles.iconWrap, { backgroundColor: isCredit ? COLORS.surfaceHover : COLORS.errorBg }]}>
                  <MaterialIcons name={movementIcon(item.type)} size={22} color={color} />
                </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filters: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  statementLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  statementText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primaryDark,
    fontWeight: '500',
  },
  list: {
    padding: SPACING.lg,
    gap: SPACING.md,
    flexGrow: 1,
  },
  card: {
    padding: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
