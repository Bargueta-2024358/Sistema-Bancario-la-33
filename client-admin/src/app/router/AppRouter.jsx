import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from '../../features/auth/pages/AuthPage.jsx';
import { ProtecterRoute } from './ProtecterRoute.jsx';
import { DashboardPage } from '../layouts/DashboardPage.jsx';
import { RoleGuard } from './RoleGuard.jsx';
import { Products } from '../../features/products/components/Products.jsx';
import { Currencies } from '../../features/currencies/components/Currencies.jsx';
import { AccountTypes } from '../../features/accountTypes/components/AccountTypes.jsx';
import { ExchangeRates } from '../../features/exchangeRates/components/ExchangeRates.jsx';
import { Users } from '../../features/users/components/Users.jsx';
import { VerifyEmailPage } from '../../features/auth/pages/VerifyEmailPage.jsx';
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage.jsx';
import { AdminDashboard } from '../../features/dashboard/AdminDashboard.jsx';
import { AdminAccountsPage } from '../../features/banking/admin/AdminAccountsPage.jsx';
import { ClientDashboard } from '../../features/dashboard/ClientDashboard.jsx';
import { ClientAccountsPage } from '../../features/banking/client/ClientAccountsPage.jsx';
import { TransferPage } from '../../features/banking/client/TransferPage.jsx';
import { HistoryPage } from '../../features/banking/client/HistoryPage.jsx';
import { ProfilePage } from '../../features/profile/ProfilePage.jsx';
import { WithdrawPage } from '../../features/banking/client/WithdrawPage.jsx';
import { CurrencyConvertPage } from '../../features/currencies/client/CurrencyConvertPage.jsx';
import { useAuthStore } from '../../features/auth/store/authStore';
import { HomePage } from '../../features/home/pages/HomePage.jsx';

const HomeRedirect = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  if (!isAuthenticated) return <HomePage />;
  const role = user?.role;
  if (role === 'ADMIN_ROLE' || role === 'ADMIN') return <Navigate to="/admin" replace />;
  return <Navigate to="/client" replace />;
};

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/confirm-email" element={<Navigate to="/auth?view=confirm" replace />} />

      <Route
        path="/admin/*"
        element={
          <ProtecterRoute>
            <RoleGuard allowedRoles={['ADMIN_ROLE', 'ADMIN']}>
              <DashboardPage variant="admin" />
            </RoleGuard>
          </ProtecterRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="accounts" element={<AdminAccountsPage />} />
        <Route path="products" element={<Products />} />
        <Route path="accountTypes" element={<AccountTypes />} />
        <Route path="currencies" element={<Currencies />} />
        <Route path="exchangeRates" element={<ExchangeRates />} />
      </Route>

      <Route
        path="/client/*"
        element={
          <ProtecterRoute>
            <RoleGuard allowedRoles={['USER_ROLE', 'CLIENT']}>
              <DashboardPage variant="client" />
            </RoleGuard>
          </ProtecterRoute>
        }
      >
        <Route index element={<ClientDashboard />} />
        <Route path="accounts" element={<ClientAccountsPage />} />
        <Route path="transfer" element={<TransferPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="withdraw" element={<WithdrawPage />} />
        <Route path="currencies" element={<CurrencyConvertPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/dashboard/*" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
