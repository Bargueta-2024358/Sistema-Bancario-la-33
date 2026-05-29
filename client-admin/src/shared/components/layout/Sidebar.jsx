import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/store/authStore.js';

import {
  HomeIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { label: 'Productos', to: '/dashboard/products', icon: BanknotesIcon },
  { label: 'Tipos de Cuenta', to: '/dashboard/accountTypes', icon: ClipboardDocumentListIcon },
  { label: 'Divisas', to: '/dashboard/currencies', icon: CurrencyDollarIcon },
  { label: 'Tasas de Cambio', to: '/dashboard/exchangeRates', icon: ArrowsRightLeftIcon },
  { label: 'Usuarios', to: '/dashboard/users', icon: UsersIcon },
];

export const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <aside className="w-[var(--sidebar-w)] min-h-screen bg-[#f4ede2] border-r border-[#d9ccb8] px-5 py-6 flex flex-col justify-between">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="mb-10 flex items-center gap-3">

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b7a65]">
              Admin
            </p>

            <h2 className="text-lg font-semibold text-[#3f3528]">
              La 33
            </h2>
          </div>
        </div>

        {/* NAV */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-[#fada28] text-[#3f3528] shadow-[0_8px_20px_rgba(250,218,40,0.25)]'
                      : 'text-[#6f604d] hover:bg-[#efe4d3] hover:text-[#3f3528]'
                  }`
                }
              >
                <Icon className="h-5 w-5 flex-shrink-0 opacity-80 group-hover:opacity-100 transition" />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-2xl border border-[#d9ccb8] bg-white px-4 py-3 text-sm font-medium text-[#6f604d] transition hover:bg-[#fada28]/20 hover:text-[#3f3528]"
      >
        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
        Cerrar sesión
      </button>
    </aside>
  );
};