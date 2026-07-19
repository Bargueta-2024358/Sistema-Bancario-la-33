// src/features/auth/screens/LoginScreen.jsx

import { Controller, useForm } from 'react-hook-form';
import {
  Image,
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

export default function LoginScreen({ navigation }) {
  const { handleLogin, loading, error } = useAuth();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      emailOrUsername: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    await handleLogin(values);
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
          <Image
            source={require('../../../../assets/logo_banco.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Logo Banco la 33"
          />

          <Text style={styles.title}>Banco la 33</Text>
          <Text style={styles.subtitle}>Inicia sesión en tu cuenta</Text>

          <View style={styles.card}>
            <Controller
              control={control}
              name="emailOrUsername"
              rules={{ required: 'El correo o usuario es obligatorio' }}
              render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                <Input
                  label="Correo o usuario"
                  placeholder="Correo electrónico o username"
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
              rules={{ required: 'La contraseña es obligatoria' }}
              render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                <Input
                  label="Contraseña"
                  placeholder="Contraseña"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={fieldError?.message}
                />
              )}
            />

            {error ? <Text style={styles.apiError}>{error}</Text> : null}

            <Button loading={loading} onPress={handleSubmit(onSubmit)} style={styles.submit}>
              Iniciar sesión
            </Button>
          </View>

          <Pressable
            onPress={() => navigation.navigate('Register')}
            style={styles.linkWrap}
            accessibilityRole="link"
          >
            <Text style={styles.linkText}>
              ¿No tienes cuenta?{' '}
              <Text style={styles.linkAccent}>Regístrate</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.xxl,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xxl,
    gap: SPACING.lg,
    ...SHADOWS.md,
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
