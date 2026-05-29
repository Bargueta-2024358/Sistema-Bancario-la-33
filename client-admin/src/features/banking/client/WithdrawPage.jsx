import { useEffect, useState } from 'react';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { getMyAccounts, withdraw } from '../../../shared/api/banking';
import { showError, showSuccess } from '../../../shared/utils/toast';

export const WithdrawPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const acc = await getMyAccounts();
        const list = Array.isArray(acc) ? acc : [];
        setAccounts(list);
        if (list[0]?.accountNumber) setAccountNumber(list[0].accountNumber);
      } catch (e) {
        showError(e.response?.data?.message || 'Error al cargar cuentas');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountNumber || !amount) return;
    setSubmitting(true);
    try {
      await withdraw(accountNumber, Number(amount));
      showSuccess('Retiro realizado');
      setAmount('');
    } catch (err) {
      showError(err.response?.data?.message || 'No se pudo realizar el retiro');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-lg">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-h)]">Retirar fondos</h1>
        <p className="text-sm text-[var(--text-muted)]">Retira de una de tus cuentas activas</p>
      </header>
      {accounts.length === 0 ? (
        <p className="text-[var(--text-muted)]">No tienes cuentas disponibles.</p>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 space-y-4">
          <div>
            <label className="text-sm text-[var(--text-muted)]">Cuenta</label>
            <select
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2"
            >
              {accounts.map((a) => (
                <option key={a.accountNumber} value={a.accountNumber}>
                  {a.accountNumber}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-[var(--text-muted)]">Monto (Q)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-3 rounded-xl font-medium disabled:opacity-50"
          >
            {submitting ? 'Procesando…' : 'Retirar'}
          </button>
        </form>
      )}
    </div>
  );
};
