// src/features/shared/ScreenHeader.jsx

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING } from '../../shared/constants/theme.js';

export function ScreenHeader({ title, subtitle, onBack }) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.back} accessibilityRole="button">
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </Pressable>
      ) : (
        <View style={styles.backSpacer} />
      )}
      <View style={styles.titles}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
    backgroundColor: COLORS.background,
  },
  back: {
    padding: SPACING.xs,
  },
  backSpacer: {
    width: 32,
  },
  titles: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
});
