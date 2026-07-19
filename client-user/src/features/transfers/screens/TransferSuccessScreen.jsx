// src/features/transfers/screens/TransferSuccessScreen.jsx

import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../../shared/components/common/Button.jsx';
import { Card } from '../../../shared/components/common/Common.jsx';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../../shared/constants/theme.js';
import { formatQuetzales } from '../../../shared/utils/formatCurrency.js';

export default function TransferSuccessScreen({ navigation, route }) {
  const {
    fromAccountNumber,
    toAccountNumber,
    amount,
    description,
    accountType,
  } = route.params || {};

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <MaterialIcons name="check-circle" size={72} color={COLORS.success} />
        </View>

        <Text style={styles.title}>Transferencia exitosa</Text>
        <Text style={styles.subtitle}>Tu operación se realizó correctamente</Text>

        <Card style={styles.card}>
          <Row label="Monto" value={formatQuetzales(amount)} highlight />
          <Row label="Desde" value={fromAccountNumber} />
          <Row label="Hacia" value={toAccountNumber} />
          {accountType ? <Row label="Tipo de cuenta" value={accountType} /> : null}
          {description ? <Row label="Descripción" value={description} /> : null}
        </Card>

        <Button
          onPress={() =>
            navigation.navigate('NewTransfer', {
              fromAccountNumber,
            })
          }
          style={styles.btn}
        >
          Nueva transferencia
        </Button>

        <Button
          variant="secondary"
          onPress={() => navigation.getParent()?.navigate('AccountsTab')}
          style={styles.btn}
        >
          Ver mis cuentas
        </Button>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, highlight }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.highlight]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    gap: SPACING.md,
  },
  row: {
    gap: 2,
  },
  rowLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
  },
  rowValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textBody,
    fontWeight: '500',
  },
  highlight: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  btn: {
    width: '100%',
  },
});
