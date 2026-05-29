import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/store/authStore.js';
import {
  HomeIcon,
  UsersIcon,
  BuildingLibraryIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: HomeIcon, end: true },
  { label: 'Usuarios', to: '/admin/users', icon: UsersIcon },
  { label: 'Cuentas bancarias', to: '/admin/accounts', icon: BuildingLibraryIcon },
  { label: 'Productos', to: '/admin/products', icon: BanknotesIcon },
  { label: 'Tipos de cuenta', to: '/admin/accountTypes', icon: ClipboardDocumentListIcon },
  { label: 'Divisas', to: '/admin/currencies', icon: CurrencyDollarIcon },
  { label: 'Tasas de cambio', to: '/admin/exchangeRates', icon: ArrowsRightLeftIcon },
];

export const AdminSidebar = () => {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <aside className="w-[var(--sidebar-w)] min-h-[calc(100vh-5rem)] bg-[#f4ede2] border-r border-[#d9ccb8] px-5 py-6 flex flex-col justify-between">
      <div>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fada28] text-[#3f3528] font-bold">33</div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b7a65]">Admin</p>
            <h2 className="text-lg font-semibold text-[#3f3528]">Banco La 33</h2>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#fada28] text-[#3f3528] shadow-md'
                      : 'text-[#6f604d] hover:bg-[#efe4d3]'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
      <button
        type="button"
        onClick={() => { logout(); navigate('/', { replace: true }); }}
        className="flex items-center gap-3 rounded-2xl border border-[#d9ccb8] bg-white px-4 py-3 text-sm font-medium text-[#6f604d] hover:bg-[#fada28]/20"
      >
        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
        Cerrar sesión
      </button>
    </aside>
  );
};
