// src/features/favorites/screens/AddFavoriteScreen.jsx

import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../shared/components/common/Button.jsx';
import { Input } from '../../../shared/components/common/Input.jsx';
import { Card } from '../../../shared/components/common/Common.jsx';
import { COLORS, SPACING } from '../../../shared/constants/theme.js';
import { ScreenHeader } from '../../shared/ScreenHeader.jsx';
import { SelectField } from '../../shared/SelectField.jsx';
import { useFavorites } from '../hooks/useFavorites.js';

const ACCOUNT_TYPES = [
  { label: 'Ahorro', value: 'Ahorro' },
  { label: 'Monetaria', value: 'Monetaria' },
  { label: 'Crédito', value: 'Crédito' },
];

export default function AddFavoriteScreen({ navigation }) {
  const { addFavorite, loading, error } = useFavorites();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      alias: '',
      accountNumber: '',
      accountType: '',
    },
  });

  const onSubmit = async (values) => {
    const result = await addFavorite(values);

    if (result.success) {
      navigation.navigate('FavoritesList');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Agregar favorito"
        subtitle="Guarda una cuenta para transferencias rápidas"
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Card style={styles.card}>
            <Controller
              control={control}
              name="alias"
              rules={{ required: 'El alias es obligatorio' }}
              render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                <Input
                  label="Alias"
                  placeholder="Ej. Mamá, Trabajo"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={fieldError?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="accountNumber"
              rules={{ required: 'El número de cuenta es obligatorio' }}
              render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                <Input
                  label="Número de cuenta"
                  placeholder="Cuenta destino"
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

            {error ? <Text style={styles.apiError}>{error}</Text> : null}

            <Button loading={loading} onPress={handleSubmit(onSubmit)}>
              Guardar favorito
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
  },
  card: {
    gap: SPACING.lg,
  },
  apiError: {
    color: COLORS.error,
    textAlign: 'center',
  },
});
