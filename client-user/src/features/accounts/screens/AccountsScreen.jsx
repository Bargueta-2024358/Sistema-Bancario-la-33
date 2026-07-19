// src/features/accounts/screens/AccountsScreen.jsx

import { useCallback, useEffect } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme.js';
import { formatQuetzales } from '../../../shared/utils/formatCurrency.js';
import { ScreenHeader } from '../../shared/ScreenHeader.jsx';
import { useAccounts } from '../hooks/useAccounts.js';

export default function AccountsScreen({ navigation }) {
  const { accounts, loading, error, fetchAccounts } = useAccounts();

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const onRefresh = useCallback(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  if (loading && accounts.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingSpinner message="Cargando cuentas..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Mis cuentas" subtitle="Consulta de saldos" />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={accounts}
        keyExtractor={(item) => item._id || item.accountNumber}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={COLORS.primaryDark}
            colors={[COLORS.primaryDark]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="account-balance-wallet"
            title="Sin cuentas"
            description="No tienes cuentas activas. Contacta al administrador."
          />
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate('AccountDetail', {
                accountNumber: item.accountNumber,
                accountTypeName: item.accountTypeName,
                balance: item.balance,
              })
            }
          >
            <Card style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.label}>Número de cuenta</Text>
                  <Text style={styles.accountNumber}>{item.accountNumber}</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.accountTypeName || 'Sin tipo'}</Text>
                </View>
              </View>
              <Text style={styles.balance}>{formatQuetzales(item.balance)}</Text>
              <Text style={styles.status}>
                {item.isActive !== false ? 'Activa' : 'Inactiva'}
              </Text>
            </Card>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.lg,
    gap: SPACING.lg,
    flexGrow: 1,
  },
  card: {
    gap: SPACING.md,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
  },
  accountNumber: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  badge: {
    backgroundColor: COLORS.surfaceHover,
    borderRadius: 999,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.text,
  },
  balance: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.success,
  },
  status: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
  },
  error: {
    color: COLORS.error,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
});
