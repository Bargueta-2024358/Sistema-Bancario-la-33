// src/features/favorites/screens/FavoritesScreen.jsx

import { useCallback, useEffect } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../../shared/components/common/Button.jsx';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common.jsx';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme.js';
import { ScreenHeader } from '../../shared/ScreenHeader.jsx';
import { useFavorites } from '../hooks/useFavorites.js';

export default function FavoritesScreen({ navigation }) {
  const { favorites, loading, error, fetchFavorites, removeFavorite } = useFavorites();

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const onRefresh = useCallback(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const confirmDelete = (favorite) => {
    Alert.alert(
      'Eliminar favorito',
      `¿Eliminar "${favorite.alias}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => removeFavorite(favorite._id || favorite.id),
        },
      ],
    );
  };

  const goToTransfer = (favorite) => {
    navigation.getParent()?.navigate('TransferTab', {
      screen: 'NewTransfer',
      params: {
        toAccountNumber: favorite.accountNumber,
        accountType: favorite.accountType || '',
      },
    });
  };

  if (loading && favorites.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingSpinner message="Cargando favoritos..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Favoritos" subtitle="Cuentas guardadas para transferir" />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item._id || item.id)}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={COLORS.primaryDark}
            colors={[COLORS.primaryDark]}
          />
        }
        ListHeaderComponent={
          <Button onPress={() => navigation.navigate('AddFavorite')} style={styles.addBtn}>
            Agregar favorito
          </Button>
        }
        ListEmptyComponent={
          <EmptyState
            icon="star-border"
            title="Sin favoritos"
            description="Guarda cuentas frecuentes para transferir más rápido."
          />
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="star" size={22} color={COLORS.primaryDark} />
              </View>
              <View style={styles.info}>
                <Text style={styles.alias}>{item.alias}</Text>
                <Text style={styles.account}>{item.accountNumber}</Text>
                {item.accountType ? (
                  <Text style={styles.type}>{item.accountType}</Text>
                ) : null}
              </View>
              <Pressable onPress={() => confirmDelete(item)} style={styles.delete}>
                <MaterialIcons name="delete-outline" size={22} color={COLORS.error} />
              </Pressable>
            </View>
            <Button variant="secondary" onPress={() => goToTransfer(item)}>
              Transferir
            </Button>
          </Card>
        )}
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
    gap: SPACING.lg,
    flexGrow: 1,
  },
  addBtn: {
    marginBottom: SPACING.sm,
  },
  card: {
    gap: SPACING.md,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  alias: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  account: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textBody,
    fontFamily: 'monospace',
  },
  type: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
  },
  delete: {
    padding: SPACING.xs,
  },
  error: {
    color: COLORS.error,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
});
