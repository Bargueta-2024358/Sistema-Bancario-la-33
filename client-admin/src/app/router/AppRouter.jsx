import { Routes, Route } from 'react-router-dom';
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
export const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<AuthPage />} />
      <Route path='/verify-email' element={<VerifyEmailPage />} />
        <Route
        path='/dashboard/*'
        element={
          <ProtecterRoute>
            <RoleGuard allowedRoles={['ADMIN_ROLE']}>
              <DashboardPage />
            </RoleGuard>
          </ProtecterRoute>
        }
      >
        <Route index element={<Products />} />
        <Route path='products' element={<Products />} />
        <Route path='accountTypes' element={<AccountTypes />} />
        <Route path='currencies' element={<Currencies />} />
        <Route path='exchangeRates' element={<ExchangeRates />} />
        <Route path='users' element={<Users />} />
      </Route>
    </Routes>
  );
};
