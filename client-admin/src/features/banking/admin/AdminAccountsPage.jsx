import { useEffect, useState } from 'react';
import { Spinner } from '../../auth/components/Spinner.jsx';
import {
  getAllAccounts,
  adminDeposit,
  revertDeposit,
  getLastMovements,
  createAccount,
} from '../../../shared/api/banking';
import { getAccountTypes } from '../../../shared/api/admin';
import { getAllUsers } from '../../../shared/api/auth';
import { showError, showSuccess } from '../../../shared/utils/toast';
import { formatTransactionType } from '../../../shared/utils/transactionLabels';

export const AdminAccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [movements, setMovements] = useState([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [createForm, setCreateForm] = useState({ userId: '', accountTypeId: '', initialBalance: 0 });
  const canRevertMovement = (movement) => {
    if (movement?.reverted) return false;
    const elapsed = Date.now() - new Date(movement.createdAt).getTime();
    return elapsed <= 60 * 1000;
  };

  const load = async () => {
    setLoading(true);
    try {
      const [acc, u, t] = await Promise.all([
        getAllAccounts(),
        getAllUsers(),
        getAccountTypes(),
      ]);
      setAccounts(Array.isArray(acc) ? acc : []);
      const userList = Array.isArray(u?.users) ? u.users : [];
      setUsers(userList);
      const typeList = Array.isArray(t?.data) ? t.data : Array.isArray(t) ? t : [];
      setTypes(typeList);
    } catch (e) {
      showError(e.response?.data?.message || 'Error al cargar cuentas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const selectAccount = async (acc) => {
    setSelected(acc);
    try {
      const mov = await getLastMovements(acc.accountNumber);
      setMovements(Array.isArray(mov) ? mov : []);
    } catch {
      setMovements([]);
    }
  };

  const handleDeposit = async () => {
    if (!selected || !depositAmount) return;
    try {
      await adminDeposit(selected.accountNumber, Number(depositAmount));
      showSuccess('Depósito registrado');
      setDepositAmount('');
      await load();
      await selectAccount(selected);
    } catch (e) {
      showError(e.response?.data?.message || 'Error en depósito');
    }
  };

  const handleRevert = async (txId) => {
    try {
      await revertDeposit(txId);
      showSuccess('Movimiento revertido');
      await load();
      if (selected) await selectAccount(selected);
    } catch (e) {
      showError(e.response?.data?.message || 'No se pudo revertir (máx. 1 min)');
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      await createAccount({
        userId: createForm.userId,
        accountTypeId: createForm.accountTypeId || null,
        initialBalance: Number(createForm.initialBalance) || 0,
      });
      showSuccess('Cuenta creada');
      setCreateForm({ userId: '', accountTypeId: '', initialBalance: 0 });
      load();
    } catch (e) {
      showError(e.response?.data?.message || 'Error al crear cuenta');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-h)]">Cuentas bancarias</h1>
        <p className="text-sm text-[var(--text-muted)]">Depósitos, movimientos y reversión</p>
      </header>

      <form onSubmit={handleCreateAccount} className="mb-6 grid md:grid-cols-4 gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
        <select
          value={createForm.userId}
          onChange={(e) => setCreateForm({ ...createForm, userId: e.target.value })}
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
          required
        >
          <option value="">Usuario cliente</option>
          {users
            .filter((u) => {
              const r = u.role || '';
              return r === 'CLIENT' || r === 'USER_ROLE';
            })
            .map((u) => (
              <option key={u.id} value={u.id}>
                {u.username} — {u.name} {u.surname}
              </option>
            ))}
        </select>
        <select
          value={createForm.accountTypeId}
          onChange={(e) => setCreateForm({ ...createForm, accountTypeId: e.target.value })}
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
        >
          <option value="">Tipo de cuenta (opcional)</option>
          {types.map((t) => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          placeholder="Saldo inicial"
          value={createForm.initialBalance}
          onChange={(e) => setCreateForm({ ...createForm, initialBalance: e.target.value })}
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
        />
        <button type="submit" className="btn-primary rounded-xl py-2 font-medium">+ Crear cuenta</button>
      </form>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#efe4d3] text-left">
              <tr>
                <th className="p-3">Cuenta</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Usuario</th>
                <th className="p-3">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr
                  key={a._id || a.accountNumber}
                  onClick={() => selectAccount(a)}
                  className={`cursor-pointer border-t border-[var(--border)] hover:bg-[#efe4d3]/50 ${
                    selected?.accountNumber === a.accountNumber ? 'bg-[#fada28]/30' : ''
                  }`}
                >
                  <td className="p-3 font-mono">{a.accountNumber}</td>
                  <td className="p-3">{a.accountTypeName || 'Sin tipo'}</td>
                  <td className="p-3 text-[var(--text-muted)]">{a.userId?.slice(0, 8)}…</td>
                  <td className="p-3 font-semibold">Q {Number(a.balance).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
          {selected ? (
            <>
              <h2 className="font-bold text-[var(--text-h)] mb-2">Cuenta {selected.accountNumber}</h2>
              <p className="text-sm text-[var(--text-muted)] mb-4">Saldo: Q {Number(selected.balance).toLocaleString()}</p>
              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  min="1"
                  placeholder="Monto depósito"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="flex-1 rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
                />
                <button type="button" onClick={handleDeposit} className="btn-primary px-4 py-2 rounded-xl text-sm">
                  Depositar
                </button>
              </div>
              <h3 className="text-sm font-semibold mb-2">Últimos movimientos</h3>
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {movements.map((m) => (
                  <li key={m._id} className="flex justify-between items-center text-xs border-b py-2">
                    <span>
                      <span className="font-medium">{formatTransactionType(m.type)}</span> Q{m.amount}
                      <br />
                      <span className="text-[var(--text-muted)]">{new Date(m.createdAt).toLocaleString()}</span>
                    </span>
                    {canRevertMovement(m) && (
                      <button
                        type="button"
                        onClick={() => handleRevert(m._id)}
                        className="text-red-700 underline"
                      >
                        Revertir
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-[var(--text-muted)] text-sm">Selecciona una cuenta</p>
          )}
        </div>
      </div>
    </div>
  );
};
