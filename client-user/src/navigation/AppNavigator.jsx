// src/navigation/AppNavigator.jsx

import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { LoadingSpinner } from '../shared/components/common/Common.jsx';
import { COLORS } from '../shared/constants/theme.js';
import { useAuthStore } from '../shared/store/authStore.js';
import { AuthStack } from './AuthStack.jsx';
import { MainTabs } from './MainTabs.jsx';

const isClientRole = (role) => role === 'USER_ROLE' || role === 'CLIENT';

export function AppNavigator() {
  const _hasHydrated = useAuthStore((s) => s._hasHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const showMainApp = isAuthenticated && isClientRole(user?.role);

  if (!_hasHydrated) {
    return (
      <View style={styles.boot}>
        <LoadingSpinner message="Iniciando Banco la 33..." color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {showMainApp ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
