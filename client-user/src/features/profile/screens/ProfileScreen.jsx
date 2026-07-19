// src/features/profile/screens/ProfileScreen.jsx

import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useFocusEffect } from '@react-navigation/native';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../../shared/components/common/Button.jsx';
import { Input } from '../../../shared/components/common/Input.jsx';
import { Card, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../../shared/constants/theme.js';
import { formatQuetzales } from '../../../shared/utils/formatCurrency.js';
import { useAuthStore } from '../../../shared/store/authStore.js';
import { useProfile } from '../hooks/useProfile.js';
import { useNotifications } from '../hooks/useNotifications.js';

const AVATAR_DEFAULT = require('../../../../assets/avatarDefault.png');
const LOGO = require('../../../../assets/logo_banco.png');

function resolveAvatarSource(profilePicture) {
  const uri = profilePicture?.trim();
  if (uri?.startsWith('http')) {
    return { uri };
  }
  return AVATAR_DEFAULT;
}

function ReadOnlyRow({ label, value }) {
  return (
    <View style={styles.readRow}>
      <Text style={styles.readLabel}>{label}</Text>
      <Text style={styles.readValue}>{value || 'No registrado'}</Text>
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  const logout = useAuthStore((s) => s.logout);
  const { profile, loading, error, fetchProfile, saveProfile } = useProfile();
  const { unreadCount, fetchUnreadCount } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      address: '',
      job: '',
      income: '',
    },
  });

  const loadProfile = useCallback(async () => {
    const data = await fetchProfile();
    if (data) {
      reset({
        name: data.name || '',
        address: data.address || '',
        job: data.job || '',
        income: data.income != null ? String(data.income) : '',
      });
    }
  }, [fetchProfile, reset]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount();
    }, [fetchUnreadCount]),
  );

  const onSave = async (values) => {
    const result = await saveProfile(values);
    if (result.success) {
      setIsEditing(false);
      await loadProfile();
    }
  };

  const confirmLogout = () => {
    Alert.alert('Cerrar sesión', '¿Deseas salir de tu cuenta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  const cancelEdit = () => {
    if (profile) {
      reset({
        name: profile.name || '',
        address: profile.address || '',
        job: profile.job || '',
        income: profile.income != null ? String(profile.income) : '',
      });
    }
    setIsEditing(false);
  };

  if (loading && !profile) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingSpinner message="Cargando perfil..." />
      </SafeAreaView>
    );
  }

  const user = profile || {};

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.brandHeader}>
        <Image source={LOGO} style={styles.logo} resizeMode="contain" accessibilityLabel="Logo Banco la 33" />
        <Text style={styles.brandTitle}>Banco la 33</Text>
        <Pressable
          onPress={() => navigation.navigate('NotificationsScreen')}
          style={styles.bell}
          accessibilityRole="button"
          accessibilityLabel="Notificaciones"
        >
          <MaterialIcons name="notifications-none" size={26} color={COLORS.text} />
          {unreadCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Mi perfil</Text>
        <Text style={styles.pageSubtitle}>
          Consulta tu información y actualiza solo los datos permitidos.
        </Text>

        <Card style={styles.card}>
          <View style={styles.avatarRow}>
            <Image
              source={resolveAvatarSource(user.profilePicture)}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.avatarInfo}>
              <Text style={styles.displayName}>{user.name || user.username || 'Cliente'}</Text>
              <Text style={styles.username}>@{user.username || 'usuario'}</Text>
            </View>
            {!isEditing ? (
              <Pressable onPress={() => setIsEditing(true)} style={styles.editChip}>
                <Text style={styles.editChipText}>Editar</Text>
              </Pressable>
            ) : null}
          </View>

          {isEditing ? (
            <View style={styles.form}>
              <Text style={styles.formHint}>
                Campos editables: nombre, dirección, trabajo e ingresos.
              </Text>

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
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={fieldError?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="address"
                rules={{ maxLength: { value: 200, message: 'Máximo 200 caracteres' } }}
                render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                  <Input
                    label="Dirección"
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
                rules={{ maxLength: { value: 100, message: 'Máximo 100 caracteres' } }}
                render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                  <Input
                    label="Trabajo"
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
                  validate: (value) => {
                    const num = Number(value);
                    if (Number.isNaN(num) || num < 0) {
                      return 'Ingresa un monto válido';
                    }
                    return true;
                  },
                }}
                render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
                  <Input
                    label="Ingresos mensuales (Q)"
                    keyboardType="decimal-pad"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={fieldError?.message}
                  />
                )}
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <View style={styles.formActions}>
                <Button loading={loading} onPress={handleSubmit(onSave)} style={styles.flexBtn}>
                  Guardar cambios
                </Button>
                <Button variant="secondary" onPress={cancelEdit} style={styles.flexBtn}>
                  Cancelar
                </Button>
              </View>
            </View>
          ) : (
            <View style={styles.readSection}>
              <ReadOnlyRow label="Usuario" value={user.username ? `@${user.username}` : null} />
              <ReadOnlyRow label="Nombre" value={user.name} />
              <ReadOnlyRow label="Apellido" value={user.surname} />
              <ReadOnlyRow label="Correo" value={user.email} />
              <ReadOnlyRow label="Teléfono" value={user.phone} />
              <ReadOnlyRow label="DPI" value={user.dpi} />
              <ReadOnlyRow label="Dirección" value={user.address} />
              <ReadOnlyRow label="Trabajo" value={user.job} />
              <ReadOnlyRow
                label="Ingresos mensuales"
                value={
                  user.income != null && Number.isFinite(Number(user.income))
                    ? formatQuetzales(user.income)
                    : null
                }
              />
            </View>
          )}
        </Card>

        <Pressable onPress={confirmLogout} style={styles.logoutBtn} accessibilityRole="button">
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  logo: {
    width: 40,
    height: 40,
  },
  brandTitle: {
    flex: 1,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  bell: {
    padding: SPACING.xs,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    gap: SPACING.md,
  },
  pageTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  pageSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  card: {
    gap: SPACING.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarInfo: {
    flex: 1,
    gap: 2,
  },
  displayName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  username: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
  },
  editChip: {
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  editChipText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: COLORS.textBody,
  },
  readSection: {
    gap: SPACING.md,
  },
  readRow: {
    gap: 2,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  readLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
  },
  readValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: COLORS.text,
  },
  form: {
    gap: SPACING.lg,
  },
  formHint: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
  },
  formActions: {
    gap: SPACING.md,
  },
  flexBtn: {
    width: '100%',
  },
  error: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    textAlign: 'center',
  },
  logoutBtn: {
    marginTop: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
});
