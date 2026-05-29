import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore';

export const RoleGuard = ({ children, allowedRoles = [] }) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const role = user?.role;
  let normalizedRole = role;
  if (role === 'ADMIN') normalizedRole = 'ADMIN_ROLE';
  if (role === 'CLIENT') normalizedRole = 'USER_ROLE';
  const hasAccess = isAuthenticated && allowedRoles.includes(normalizedRole);

  if (!hasAccess) {
    return <Navigate to='/' replace />;
  }

  return children;
};
