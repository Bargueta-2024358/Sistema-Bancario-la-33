// src/shared/components/common/Button.jsx

import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { COLORS, BORDER_RADIUS, FONT_SIZE, SHADOWS, SPACING } from '../../constants/theme.js';

const VARIANTS = {
  primary: {
    container: {
      backgroundColor: COLORS.primary,
      borderWidth: 0,
      ...SHADOWS.primary,
    },
    containerPressed: {
      backgroundColor: COLORS.primaryDark,
    },
    text: {
      color: COLORS.text,
      fontWeight: '600',
    },
    spinner: COLORS.text,
  },
  secondary: {
    container: {
      backgroundColor: COLORS.white,
      borderWidth: 1,
      borderColor: COLORS.border,
      ...SHADOWS.sm,
    },
    containerPressed: {
      backgroundColor: COLORS.surfaceHover,
    },
    text: {
      color: COLORS.textBody,
      fontWeight: '500',
    },
    spinner: COLORS.textBody,
  },
};

export function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...props
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        v.container,
        pressed && !isDisabled && v.containerPressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={v.spinner} size="small" />
      ) : (
        <Text style={[styles.text, v.text, textStyle]}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    minHeight: 48,
  },
  text: {
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
});
