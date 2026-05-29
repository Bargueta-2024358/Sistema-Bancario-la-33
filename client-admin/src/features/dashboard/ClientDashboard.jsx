import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../../shared/components/ui/StatCard.jsx';
import { Spinner } from '../auth/components/Spinner.jsx';
import { getMyAccounts } from '../../shared/api/banking';
import { getUnreadCount } from '../../shared/api/notifications';
import { useAuthStore } from '../auth/store/authStore';

export const ClientDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [acc, count] = await Promise.all([
          getMyAccounts(),
          getUnreadCount().catch(() => 0),
        ]);
        setAccounts(Array.isArray(acc) ? acc : []);
        setUnread(count);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const total = accounts.reduce((s, a) => s + Number(a.balance || 0), 0);

  if (loading) return <Spinner />;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-h)]">Hola, {user?.username}</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Tu banca en línea — Banco La 33</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatCard label="Saldo total" value={`Q ${total.toLocaleString()}`} accent="text-emerald-800" />
        <StatCard label="Cuentas activas" value={accounts.length} />
        <StatCard label="Notificaciones" value={unread} hint="sin leer" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {accounts.map((a) => (
          <div key={a._id || a.accountNumber} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-[var(--text-muted)]">Cuenta</p>
                <p className="font-mono font-bold text-[var(--text-h)]">{a.accountNumber}</p>
              </div>
              <span className="rounded-full bg-[#efe4d3] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-h)]">
                {a.accountTypeName || 'Sin tipo'}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-emerald-800">Q {Number(a.balance).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/client/transfer" className="btn-primary px-5 py-2 rounded-xl">Transferir</Link>
        <Link to="/client/history" className="px-5 py-2 rounded-xl border border-[var(--border)] bg-white">Ver historial</Link>
      </div>
    </div>
  );
};
