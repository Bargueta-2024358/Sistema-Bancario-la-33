// src/features/auth/screens/RegisterScreen.jsx

import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
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
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../../../shared/constants/theme.js';
import { useAuth } from '../hooks/useAuth.js';

export default function RegisterScreen({ navigation }) {
  const { handleRegister, loading, error } = useAuth();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      surname: '',
      username: '',
      email: '',
      password: '',
      phone: '',
      dpi: '',
      address: '',
      job: '',
      income: '',
    },
  });

  const onSubmit = async (values) => {
    const result = await handleRegister(values);

    if (!result.success) {
      return;
    }

    if (result.emailVerificationRequired) {
      Alert.alert(
        'Registro exitoso',
        'Debes verificar tu correo electrónico antes de poder iniciar sesión. Revisa tu bandeja de entrada y el enlace de confirmación.',
        [{ text: 'Ir a iniciar sesión', onPress: () => navigation.navigate('Login') }],
      );
      return;
    }

    Alert.alert(
      'Registro exitoso',
      result.message || 'Tu cuenta ha sido creada correctamente.',
      [{ text: 'Iniciar sesión', onPress: () => navigation.navigate('Login') }],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Únete a Banco la 33</Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: 'El nombre es obligatorio',
                  maxLength: { value: 25, message: 'Máximo 25 caracteres' },
                }}
                render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                  <Input
                    label="Nombre"
                    placeholder="Tu nombre"
                    style={styles.half}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={fieldError?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="surname"
                rules={{
                  required: 'El apellido es obligatorio',
                  maxLength: { value: 25, message: 'Máximo 25 caracteres' },
                }}
                render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                  <Input
                    label="Apellido"
                    placeholder="Tu apellido"
                    style={styles.half}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={fieldError?.message}
                  />
                )}
              />
            </View>

            <Controller
              control={control}
              name="username"
              rules={{
                required: 'El usuario es obligatorio',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
              }}
              render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                <Input
                  label="Usuario"
                  placeholder="Tu usuario"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={fieldError?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{
                required: 'El correo es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo inválido',
                },
              }}
              render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                <Input
                  label="Correo electrónico"
                  placeholder="correo@ejemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={fieldError?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{
                required: 'La contraseña es obligatoria',
                minLength: { value: 8, message: 'Mínimo 8 caracteres' },
              }}
              render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                <Input
                  label="Contraseña"
                  placeholder="Contraseña segura"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={fieldError?.message}
                />
              )}
            />

            <View style={styles.row}>
              <Controller
                control={control}
                name="phone"
                rules={{
                  required: 'El teléfono es obligatorio',
                  pattern: {
                    value: /^\d{8}$/,
                    message: 'Debe tener exactamente 8 dígitos',
                  },
                }}
                render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                  <Input
                    label="Teléfono"
                    placeholder="50212345"
                    keyboardType="phone-pad"
                    maxLength={8}
                    style={styles.half}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={fieldError?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="dpi"
                rules={{
                  required: 'El DPI es obligatorio',
                  pattern: {
                    value: /^\d{13}$/,
                    message: 'Debe tener exactamente 13 dígitos',
                  },
                }}
                render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                  <Input
                    label="DPI"
                    placeholder="13 dígitos"
                    keyboardType="number-pad"
                    maxLength={13}
                    style={styles.half}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={fieldError?.message}
                  />
                )}
              />
            </View>

            <Controller
              control={control}
              name="address"
              rules={{ required: 'La dirección es obligatoria' }}
              render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                <Input
                  label="Dirección"
                  placeholder="Dirección de residencia"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={fieldError?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="job"
              rules={{ required: 'El trabajo es obligatorio' }}
              render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                <Input
                  label="Trabajo"
                  placeholder="Nombre del trabajo"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={fieldError?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="income"
              rules={{
                required: 'Los ingresos son obligatorios',
                validate: (value) => {
                  const num = Number(value);
                  if (Number.isNaN(num)) {
                    return 'Ingresa un monto numérico válido';
                  }
                  if (num < 100) {
                    return 'Los ingresos deben ser al menos Q 100.00';
                  }
                  return true;
                },
              }}
              render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                <Input
                  label="Ingresos mensuales (Q)"
                  placeholder="100.00"
                  keyboardType="decimal-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={fieldError?.message}
                />
              )}
            />

            {error ? <Text style={styles.apiError}>{error}</Text> : null}

            <Button loading={loading} onPress={handleSubmit(onSubmit)} style={styles.submit}>
              Registrarse
            </Button>
          </View>

          <Pressable
            onPress={() => navigation.navigate('Login')}
            style={styles.linkWrap}
            accessibilityRole="link"
          >
            <Text style={styles.linkText}>
              ¿Ya tienes cuenta?{' '}
              <Text style={styles.linkAccent}>Inicia sesión</Text>
            </Text>
          </Pressable>
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
  scroll: {
    flexGrow: 1,
    padding: SPACING.xxl,
    paddingBottom: SPACING.xxxl,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xxl,
    gap: SPACING.lg,
    ...SHADOWS.md,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  half: {
    flex: 1,
  },
  apiError: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    textAlign: 'center',
  },
  submit: {
    marginTop: SPACING.sm,
  },
  linkWrap: {
    marginTop: SPACING.xxl,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  linkText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textBody,
    textAlign: 'center',
  },
  linkAccent: {
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
});
