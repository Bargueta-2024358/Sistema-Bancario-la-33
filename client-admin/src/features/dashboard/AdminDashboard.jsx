import { useEffect, useState } from 'react';
import { StatCard } from '../../shared/components/ui/StatCard.jsx';
import { Spinner } from '../auth/components/Spinner.jsx';
import { getAllAccounts, getTopMovements } from '../../shared/api/banking';
import { getAllUsers } from '../../shared/api/auth';
import { getGlobalReport } from '../../shared/api/reports';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ accounts: 0, users: 0, deposits: 0, top: [] });

  useEffect(() => {
    const load = async () => {
      try {
        const [accounts, usersRes, global, top] = await Promise.all([
          getAllAccounts().catch(() => []),
          getAllUsers().catch(() => ({ users: [] })),
          getGlobalReport().catch(() => null),
          getTopMovements().catch(() => []),
        ]);
        setStats({
          accounts: Array.isArray(accounts) ? accounts.length : 0,
          users: usersRes.users?.length || 0,
          deposits: global?.summary?.totalDeposits ?? 0,
          top: Array.isArray(top) ? top.slice(0, 5) : [],
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-h)]">Panel administrativo</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Resumen del sistema bancario</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8">
        <StatCard label="Cuentas activas" value={stats.accounts} />
        <StatCard label="Usuarios" value={stats.users} />
        <StatCard label="Depósitos (reportes)" value={`Q ${Number(stats.deposits).toLocaleString()}`} accent="text-emerald-700" />
        <StatCard label="Acceso rápido" value={<Link to="/admin/accounts" className="text-[#daa520] underline text-lg">Cuentas →</Link>} />
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text-h)] mb-4">Cuentas con más movimientos</h2>
        {stats.top.length === 0 ? (
          <p className="text-[var(--text-muted)] text-sm">Sin datos aún</p>
        ) : (
          <ul className="space-y-2">
            {stats.top.map((row) => (
              <li key={row._id || row.accountNumber} className="flex justify-between text-sm border-b border-[var(--border)] py-2">
                <span className="font-medium text-[var(--text-h)]">{row._id || row.account?.accountNumber}</span>
                <span className="text-[var(--text-muted)]">{row.movementCount} movimientos</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
