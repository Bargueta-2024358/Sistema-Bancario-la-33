import { useEffect, useState } from 'react';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { getMyAccounts, getBalance } from '../../../shared/api/banking';
import { showError } from '../../../shared/utils/toast';

export const ClientAccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const acc = await getMyAccounts();
        const list = Array.isArray(acc) ? acc : [];
        const withBalance = await Promise.all(
          list.map(async (a) => {
            try {
              const b = await getBalance(a.accountNumber);
              return { ...a, balance: b.balance ?? a.balance };
            } catch {
              return a;
            }
          })
        );
        setAccounts(withBalance);
      } catch (e) {
        showError(e.response?.data?.message || 'Error al cargar cuentas');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-h)]">Mis cuentas</h1>
        <p className="text-sm text-[var(--text-muted)]">Consulta de saldos</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {accounts.map((a) => (
          <div key={a._id || a.accountNumber} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm text-[var(--text-muted)]">Número de cuenta</p>
                <p className="font-mono text-xl font-bold text-[var(--text-h)] mt-1">{a.accountNumber}</p>
              </div>
              <span className="rounded-full bg-[#efe4d3] px-3 py-1 text-xs font-semibold text-[var(--text-h)]">
                {a.accountTypeName || 'Sin tipo'}
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-emerald-800">Q {Number(a.balance).toLocaleString()}</p>
            <p className="text-xs text-[var(--text-muted)] mt-2">{a.isActive !== false ? 'Activa' : 'Inactiva'}</p>
          </div>
        ))}
        {accounts.length === 0 && (
          <p className="text-[var(--text-muted)]">No tienes cuentas. Contacta al administrador.</p>
        )}
      </div>
    </div>
  );
};
