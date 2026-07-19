// src/navigation/MainTabs.jsx

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import AccountsScreen from '../features/accounts/screens/AccountsScreen.jsx';
import AccountDetailScreen from '../features/accounts/screens/AccountDetailScreen.jsx';
import ConvertBalanceScreen from '../features/accounts/screens/ConvertBalanceScreen.jsx';
import NewTransferScreen from '../features/transfers/screens/NewTransferScreen.jsx';
import TransferSuccessScreen from '../features/transfers/screens/TransferSuccessScreen.jsx';
import FavoritesScreen from '../features/favorites/screens/FavoritesScreen.jsx';
import AddFavoriteScreen from '../features/favorites/screens/AddFavoriteScreen.jsx';
import MovementsScreen from '../features/movements/screens/MovementsScreen.jsx';
import AccountStatementScreen from '../features/movements/screens/AccountStatementScreen.jsx';
import ProfileScreen from '../features/profile/screens/ProfileScreen.jsx';
import NotificationsScreen from '../features/profile/screens/NotificationsScreen.jsx';
import { COLORS, FONT_SIZE } from '../shared/constants/theme.js';

const Tab = createBottomTabNavigator();
const AccountsStackNav = createNativeStackNavigator();
const TransferStackNav = createNativeStackNavigator();
const FavoritesStackNav = createNativeStackNavigator();
const MovementsStackNav = createNativeStackNavigator();
const ProfileStackNav = createNativeStackNavigator();

const STACK_HEADER_HIDDEN = { headerShown: false };

const PROFILE_STACK_HEADER = {
  headerShown: true,
  headerStyle: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTintColor: COLORS.text,
  headerTitleStyle: {
    fontWeight: '600',
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
  },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: COLORS.background },
};

function AccountsStack() {
  return (
    <AccountsStackNav.Navigator screenOptions={STACK_HEADER_HIDDEN}>
      <AccountsStackNav.Screen name="AccountsList" component={AccountsScreen} />
      <AccountsStackNav.Screen name="AccountDetail" component={AccountDetailScreen} />
      <AccountsStackNav.Screen name="ConvertBalance" component={ConvertBalanceScreen} />
    </AccountsStackNav.Navigator>
  );
}

function TransferStack() {
  return (
    <TransferStackNav.Navigator screenOptions={STACK_HEADER_HIDDEN}>
      <TransferStackNav.Screen name="NewTransfer" component={NewTransferScreen} />
      <TransferStackNav.Screen name="TransferSuccess" component={TransferSuccessScreen} />
    </TransferStackNav.Navigator>
  );
}

function FavoritesStack() {
  return (
    <FavoritesStackNav.Navigator screenOptions={STACK_HEADER_HIDDEN}>
      <FavoritesStackNav.Screen name="FavoritesList" component={FavoritesScreen} />
      <FavoritesStackNav.Screen name="AddFavorite" component={AddFavoriteScreen} />
    </FavoritesStackNav.Navigator>
  );
}

function MovementsStack() {
  return (
    <MovementsStackNav.Navigator screenOptions={STACK_HEADER_HIDDEN}>
      <MovementsStackNav.Screen name="MovementsList" component={MovementsScreen} />
      <MovementsStackNav.Screen name="AccountStatement" component={AccountStatementScreen} />
    </MovementsStackNav.Navigator>
  );
}

function ProfileStack() {
  return (
    <ProfileStackNav.Navigator screenOptions={PROFILE_STACK_HEADER}>
      <ProfileStackNav.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStackNav.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={{ title: 'Notificaciones' }}
      />
    </ProfileStackNav.Navigator>
  );
}

function TabIcon({ name, color, size }) {
  return <MaterialIcons name={name} size={size} color={color} />;
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primaryDark,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          height: 60,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: FONT_SIZE.xs,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="AccountsTab"
        component={AccountsStack}
        options={{
          title: 'Cuentas',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="account-balance-wallet" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="TransferTab"
        component={TransferStack}
        options={{
          title: 'Transferencias',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="swap-horiz" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStack}
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="star" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MovementsTab"
        component={MovementsStack}
        options={{
          title: 'Movimientos',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="history" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          title: 'Perfil',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
