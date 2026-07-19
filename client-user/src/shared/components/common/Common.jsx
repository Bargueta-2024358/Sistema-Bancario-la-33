// src/shared/components/common/Common.jsx

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, FONT_SIZE, SPACING, SHADOWS } from '../../constants/theme.js';

export function LoadingSpinner({
  message = 'Cargando...',
  size = 'large',
  color = COLORS.primaryDark,
}) {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size={size} color={color} />
      {message ? <Text style={styles.mutedText}>{message}</Text> : null}
    </View>
  );
}

export function EmptyState({
  icon = 'inbox',
  title = 'Sin resultados',
  description,
}) {
  return (
    <View style={styles.centered}>
      <View style={styles.iconCircle}>
        <MaterialIcons name={icon} size={32} color={COLORS.textLight} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.mutedText}>{description}</Text> : null}
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
    gap: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  mutedText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});
