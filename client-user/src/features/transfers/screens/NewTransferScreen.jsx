// src/features/transfers/screens/NewTransferScreen.jsx

import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../shared/components/common/Button.jsx';
import { Input } from '../../../shared/components/common/Input.jsx';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme.js';
import { formatQuetzales } from '../../../shared/utils/formatCurrency.js';
import { useAccounts } from '../../accounts/hooks/useAccounts.js';
import { useFavorites } from '../../favorites/hooks/useFavorites.js';
import { ScreenHeader } from '../../shared/ScreenHeader.jsx';
import { SelectField } from '../../shared/SelectField.jsx';
import { useTransfers } from '../hooks/useTransfers.js';

const ACCOUNT_TYPES = [
  { label: 'Ahorro', value: 'Ahorro' },
  { label: 'Monetaria', value: 'Monetaria' },
  { label: 'Crédito', value: 'Crédito' },
];

export default function NewTransferScreen({ navigation, route }) {
  const fromAccountNumberParam = route.params?.fromAccountNumber;
  const toAccountNumberParam = route.params?.toAccountNumber;
  const accountTypeParam = route.params?.accountType;
  const { accounts, loading: accountsLoading, fetchAccounts } = useAccounts();
  const { favorites, fetchFavorites } = useFavorites();
  const { transfer, loading, error } = useTransfers();

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      fromAccountNumber: fromAccountNumberParam || '',
      toAccountNumber: toAccountNumberParam || '',
      accountType: accountTypeParam || '',
      amount: '',
      description: '',
    },
  });

  const fromAccountNumber = watch('fromAccountNumber');

  useEffect(() => {
    fetchAccounts();
    fetchFavorites();
  }, [fetchAccounts, fetchFavorites]);

  useEffect(() => {
    if (!fromAccountNumber && accounts[0]) {
      setValue('fromAccountNumber', accounts[0].accountNumber);
    }
  }, [accounts, fromAccountNumber, setValue]);

  useEffect(() => {
    if (fromAccountNumberParam) {
      setValue('fromAccountNumber', fromAccountNumberParam);
    }
    if (toAccountNumberParam) {
      setValue('toAccountNumber', toAccountNumberParam);
    }
    if (accountTypeParam) {
      setValue('accountType', accountTypeParam);
    }
  }, [fromAccountNumberParam, toAccountNumberParam, accountTypeParam, setValue]);

  const applyFavorite = useCallback(
    (favorite) => {
      setValue('toAccountNumber', favorite.accountNumber);
      if (favorite.accountType) {
        setValue('accountType', favorite.accountType);
      }
    },
    [setValue],
  );

  const onSubmit = async (values) => {
    const result = await transfer(values.fromAccountNumber, values);

    if (result.success) {
      navigation.navigate('TransferSuccess', {
        fromAccountNumber: values.fromAccountNumber,
        toAccountNumber: values.toAccountNumber,
        amount: Number(values.amount),
        description: values.description,
        accountType: values.accountType,
      });
    }
  };

  if (accountsLoading && accounts.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingSpinner message="Cargando cuentas..." />
      </SafeAreaView>
    );
  }

  const accountOptions = accounts.map((a) => ({
    label: `${a.accountNumber} — ${formatQuetzales(a.balance)}`,
    value: a.accountNumber,
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Nueva transferencia"
        subtitle="Máx. Q2,000 por operación · Q10,000 diarios"
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Card style={styles.card}>
            <Controller
              control={control}
              name="fromAccountNumber"
              rules={{ required: 'Selecciona la cuenta origen' }}
              render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
                <SelectField
                  label="Cuenta origen"
                  value={value}
                  options={accountOptions}
                  onChange={onChange}
                  error={fieldError?.message}
                />
              )}
            />

            {favorites.length > 0 ? (
              <View style={styles.favorites}>
                <Text style={styles.favTitle}>Favoritos</Text>
                <View style={styles.favRow}>
                  {favorites.map((fav) => (
                    <Pressable
                      key={fav._id || fav.id}
                      style={styles.favChip}
                      onPress={() => applyFavorite(fav)}
                    >
                      <Text style={styles.favChipText}>{fav.alias}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}

            <Controller
              control={control}
              name="toAccountNumber"
              rules={{ required: 'La cuenta destino es obligatoria' }}
              render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                <Input
                  label="Cuenta destino"
                  placeholder="Número de cuenta destino"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={fieldError?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="accountType"
              rules={{ required: 'Selecciona el tipo de cuenta' }}
              render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
                <SelectField
                  label="Tipo de cuenta"
                  value={value}
                  options={ACCOUNT_TYPES}
                  onChange={onChange}
                  error={fieldError?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="amount"
              rules={{
                required: 'El monto es obligatorio',
                min: { value: 0.01, message: 'El monto debe ser mayor a 0' },
              }}
              render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                <Input
                  label="Monto (Q)"
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={fieldError?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Descripción (opcional)"
                  placeholder="Motivo de la transferencia"
                  multiline
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />

            {error ? <Text style={styles.apiError}>{error}</Text> : null}

            <Button loading={loading} onPress={handleSubmit(onSubmit)}>
              Transferir
            </Button>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  card: {
    gap: SPACING.lg,
  },
  favorites: {
    gap: SPACING.sm,
  },
  favTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: COLORS.textBody,
  },
  favRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  favChip: {
    backgroundColor: COLORS.surfaceHover,
    borderRadius: 999,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  favChipText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text,
    fontWeight: '500',
  },
  apiError: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    textAlign: 'center',
  },
});
