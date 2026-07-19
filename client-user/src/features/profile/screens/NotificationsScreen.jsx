// src/features/profile/screens/NotificationsScreen.jsx

import { useCallback, useEffect } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../../shared/constants/theme.js';
import { formatRelativeDate } from '../../../shared/utils/formatDate.js';
import { useNotifications } from '../hooks/useNotifications.js';

function notificationIcon(type) {
  const key = String(type || '').toUpperCase();

  if (key === 'TRANSFER') return 'swap-horiz';
  if (key === 'DEPOSIT') return 'arrow-downward';
  if (key === 'ALERT') return 'warning';
  return 'notifications';
}

export default function NotificationsScreen() {
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
  } = useNotifications();

  const load = useCallback(async () => {
    await fetchNotifications();
    await fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePress = async (item) => {
    const id = item._id || item.id;
    if (!item.read && id) {
      await markAsRead(id);
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <LoadingSpinner message="Cargando notificaciones..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item._id || item.id)}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={load}
            tintColor={COLORS.primaryDark}
            colors={[COLORS.primaryDark]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="notifications-none"
            title="Sin notificaciones"
            description="Aquí verás alertas de transferencias, depósitos y más."
          />
        }
        renderItem={({ item }) => {
          const isUnread = !item.read;

          return (
            <Pressable onPress={() => handlePress(item)}>
              <Card style={[styles.card, isUnread && styles.unreadCard]}>
                <View style={styles.row}>
                  <View style={styles.iconWrap}>
                    <MaterialIcons
                      name={notificationIcon(item.type)}
                      size={22}
                      color={COLORS.primaryDark}
                    />
                  </View>

                  <View style={styles.body}>
                    <View style={styles.titleRow}>
                      <Text style={styles.title}>{item.title}</Text>
                      {isUnread ? <View style={styles.dot} /> : null}
                    </View>
                    <Text style={styles.message}>{item.message}</Text>
                    <Text style={styles.date}>
                      {formatRelativeDate(item.createdAt)}
                    </Text>
                  </View>
                </View>
              </Card>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.lg,
    gap: SPACING.md,
    flexGrow: 1,
  },
  card: {
    padding: SPACING.lg,
  },
  unreadCard: {
    borderColor: COLORS.primary,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  body: {
    flex: 1,
    gap: SPACING.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  title: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  message: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textBody,
    lineHeight: 20,
  },
  date: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
  },
  error: {
    color: COLORS.error,
    textAlign: 'center',
    padding: SPACING.md,
  },
});
