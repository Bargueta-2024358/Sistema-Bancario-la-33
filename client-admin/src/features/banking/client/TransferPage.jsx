import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { getMyAccounts, transfer } from '../../../shared/api/banking';
import { showError, showSuccess } from '../../../shared/utils/toast';

export const TransferPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();

  const loadAccounts = async () => {
    try {
      const acc = await getMyAccounts();
      const list = Array.isArray(acc) ? acc : [];
      setAccounts(list);
      if (list[0]) setValue('fromAccountNumber', list[0].accountNumber);
    } catch (e) {
      showError(e.response?.data?.message || 'Error al cargar tus cuentas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, [setValue]);

  const onSubmit = async (values) => {
    try {
      await transfer(values.fromAccountNumber, {
        toAccountNumber: values.toAccountNumber.trim(),
        amount: Number(values.amount),
        description: values.description?.trim() || '',
        accountType: values.accountType?.trim() || '',
      });
      showSuccess('Transferencia realizada correctamente');
      await loadAccounts();
    } catch (e) {
      showError(e.response?.data?.message || 'Error en transferencia');
    }
  };

  if (loading) return <Spinner />;

  if (accounts.length === 0) {
    return (
      <div className="max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
        <h1 className="text-2xl font-bold text-[var(--text-h)]">Transferir</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          No tienes cuentas activas. Pide al administrador que te cree una cuenta.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-h)]">Transferir</h1>
        <p className="text-sm text-[var(--text-muted)]">Máx. Q2,000 por operación · Q10,000 diarios</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
        <div>
          <label className="text-sm font-medium">Cuenta origen</label>
          <select
            className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            {...register('fromAccountNumber', { required: true })}
          >
            {accounts.map((a) => (
              <option key={a.accountNumber} value={a.accountNumber}>
                {a.accountNumber} — Q{Number(a.balance).toLocaleString()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Cuenta destino</label>
          <input
            className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-mono"
            placeholder="Número de cuenta destino (otro cliente)"
            {...register('toAccountNumber', { required: 'Requerido' })}
          />
          {errors.toAccountNumber && <p className="text-red-600 text-xs mt-1">{errors.toAccountNumber.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Descripción</label>
          <textarea
            rows={3}
            maxLength={180}
            className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            placeholder="Motivo de la transferencia (opcional)"
            {...register('description')}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Tipo de cuenta</label>
          <select
            className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            defaultValue=""
            {...register('accountType', { required: 'Selecciona un tipo de cuenta' })}
          >
            <option value="">Selecciona una opción</option>
            <option value="Monetaria">Monetaria</option>
            <option value="Ahorro">Ahorro</option>
            <option value="Crédito">Crédito</option>
            <option value="Inversión">Inversión</option>
          </select>
          {errors.accountType && <p className="text-red-600 text-xs mt-1">{errors.accountType.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Monto (Q)</label>
          <input
            type="number"
            min="1"
            max="2000"
            step="0.01"
            className="mt-1 w-full rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
            {...register('amount', {
              required: 'Requerido',
              min: { value: 1, message: 'Mínimo Q1' },
              max: { value: 2000, message: 'Máximo Q2,000 por transferencia' },
            })}
          />
          {errors.amount && <p className="text-red-600 text-xs mt-1">{errors.amount.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3 rounded-xl font-semibold disabled:opacity-60">
          {isSubmitting ? 'Procesando…' : 'Transferir'}
        </button>
      </form>
    </div>
  );
};
