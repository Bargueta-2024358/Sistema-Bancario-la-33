import { useEffect, useState } from 'react';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { getMyAccounts, getTransactions } from '../../../shared/api/banking';
import { getHistory } from '../../../shared/api/reports';
import { useAuthStore } from '../../auth/store/authStore';
import { showError } from '../../../shared/utils/toast';
import { formatTransactionType } from '../../../shared/utils/transactionLabels';

export const HistoryPage = () => {
  const userId = useAuthStore((s) => s.user?.id);
  const [accounts, setAccounts] = useState([]);
  const [selected, setSelected] = useState('');
  const [txs, setTxs] = useState([]);
  const [reportTxs, setReportTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const acc = await getMyAccounts();
        const list = Array.isArray(acc) ? acc : [];
        setAccounts(list);
        if (list[0]) setSelected(list[0].accountNumber);
        if (userId) {
          const hist = await getHistory(userId, { limit: 30 });
          setReportTxs(hist.transactions || []);
        }
      } catch (e) {
        showError(e.response?.data?.message || 'Error al cargar historial');
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  useEffect(() => {
    if (!selected) return;
    (async () => {
      try {
        const data = await getTransactions(selected, 50);
        setTxs(Array.isArray(data) ? data : []);
      } catch {
        setTxs([]);
      }
    })();
  }, [selected]);

  if (loading) return <Spinner />;

  const rows = txs.length ? txs : reportTxs;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-h)]">Historial</h1>
        <p className="text-sm text-[var(--text-muted)]">Movimientos por cuenta</p>
      </header>
      {accounts.length > 0 && (
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="mb-4 rounded-xl border border-[var(--border)] px-4 py-2 text-sm bg-[var(--bg-card)]"
        >
          {accounts.map((a) => (
            <option key={a.accountNumber} value={a.accountNumber}>{a.accountNumber}</option>
          ))}
        </select>
      )}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#efe4d3] text-left">
            <tr>
              <th className="p-3">Fecha</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Monto</th>
              <th className="p-3">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t._id || t.id} className="border-t border-[var(--border)]">
                <td className="p-3 text-[var(--text-muted)]">{new Date(t.createdAt).toLocaleString()}</td>
                <td className="p-3 font-medium">{formatTransactionType(t.type)}</td>
                <td className="p-3">Q {Number(t.amount).toLocaleString()}</td>
                <td className="p-3 text-[var(--text-muted)]">{t.description || t.targetAccountNumber || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-6 text-center text-[var(--text-muted)]">Sin movimientos</p>}
      </div>
    </div>
  );
};
