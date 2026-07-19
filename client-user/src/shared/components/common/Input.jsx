// src/shared/components/common/Input.jsx

import { StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, BORDER_RADIUS, FONT_SIZE, SPACING } from '../../constants/theme.js';

export function Input({
  label,
  error,
  style,
  inputStyle,
  ...props
}) {
  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        placeholderTextColor={COLORS.placeholder}
        style={[styles.input, error && styles.inputError, inputStyle]}
        {...props}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: COLORS.textBody,
  },
  input: {
    width: '100%',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  error: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
  },
});
