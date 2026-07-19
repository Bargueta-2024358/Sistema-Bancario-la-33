// src/features/accounts/screens/AccountDetailScreen.jsx

import { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../../shared/components/common/Button.jsx';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../../shared/constants/theme.js';
import { formatQuetzales } from '../../../shared/utils/formatCurrency.js';
import { formatTransactionType } from '../../../shared/utils/transactionLabels.js';
import { ScreenHeader } from '../../shared/ScreenHeader.jsx';
import { useAccounts } from '../hooks/useAccounts.js';

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

export default function AccountDetailScreen({ navigation, route }) {
  const { accountNumber, accountTypeName, balance: initialBalance } = route.params || {};
  const { getBalance, getLastMovements, loading, error } = useAccounts();
  const [balance, setBalance] = useState(initialBalance ?? 0);
  const [movements, setMovements] = useState([]);

  const loadDetail = useCallback(async () => {
    const [freshBalance, txs] = await Promise.all([
      getBalance(accountNumber),
      getLastMovements(accountNumber),
    ]);

    if (freshBalance != null) {
      setBalance(freshBalance);
    }

    setMovements(Array.isArray(txs) ? txs : []);
  }, [accountNumber, getBalance, getLastMovements]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const goToTransfer = () => {
    navigation.getParent()?.navigate('TransferTab', {
      screen: 'NewTransfer',
      params: { fromAccountNumber: accountNumber },
    });
  };

  const goToConvert = () => {
    navigation.navigate('ConvertBalance', {
      accountNumber,
      balance,
    });
  };

  if (loading && movements.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingSpinner message="Cargando detalle..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Detalle de cuenta"
        subtitle={accountTypeName || 'Cuenta'}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo disponible</Text>
          <Text style={styles.balanceValue}>{formatQuetzales(balance)}</Text>
          <Text style={styles.accountNumber}>{accountNumber}</Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.actions}>
          <Button onPress={goToTransfer} style={styles.actionBtn}>
            Transferir
          </Button>
          <Button variant="secondary" onPress={goToConvert} style={styles.actionBtn}>
            Convertir saldo
          </Button>
        </View>

        <Text style={styles.sectionTitle}>Últimos movimientos</Text>

        {movements.length === 0 ? (
          <EmptyState icon="receipt-long" title="Sin movimientos recientes" />
        ) : (
          movements.map((tx) => (
            <Card key={tx._id || tx.id || `${tx.createdAt}-${tx.amount}`} style={styles.txCard}>
              <View style={styles.txRow}>
                <MaterialIcons
                  name={tx.type?.includes('IN') || tx.type === 'DEPOSIT' ? 'arrow-downward' : 'arrow-upward'}
                  size={20}
                  color={tx.type?.includes('IN') || tx.type === 'DEPOSIT' ? COLORS.success : COLORS.error}
                />
                <View style={styles.txInfo}>
                  <Text style={styles.txType}>{formatTransactionType(tx.type)}</Text>
                  <Text style={styles.txDate}>{formatDate(tx.createdAt)}</Text>
                  {tx.description ? (
                    <Text style={styles.txDesc}>{tx.description}</Text>
                  ) : null}
                </View>
                <Text style={styles.txAmount}>{formatQuetzales(tx.amount)}</Text>
              </View>
            </Card>
          ))
        )}
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
    paddingBottom: SPACING.xxxl,
  },
  balanceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xxl,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  balanceLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.text,
  },
  accountNumber: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textBody,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionBtn: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  txCard: {
    padding: SPACING.lg,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  txInfo: {
    flex: 1,
    gap: 2,
  },
  txType: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  txDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
  },
  txDesc: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textBody,
    marginTop: 2,
  },
  txAmount: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  error: {
    color: COLORS.error,
    textAlign: 'center',
  },
});
