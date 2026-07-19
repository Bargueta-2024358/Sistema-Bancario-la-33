// App.jsx

import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator.jsx';
import { useAuthStore } from './src/shared/store/authStore.js';

export default function App() {
  const _hasHydrated = useAuthStore((s) => s._hasHydrated);
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    if (_hasHydrated) {
      checkAuth();
    }
  }, [_hasHydrated, checkAuth]);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
