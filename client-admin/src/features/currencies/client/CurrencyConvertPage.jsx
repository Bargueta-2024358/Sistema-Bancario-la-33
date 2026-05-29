import { useEffect, useState } from 'react';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { convertCurrency, getCurrencies } from '../../../shared/api/admin';
import { showError } from '../../../shared/utils/toast';

export const CurrencyConvertPage = () => {
  const [currencies, setCurrencies] = useState([]);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('GTQ');
  const [amount, setAmount] = useState('100');
  const [preferLocal, setPreferLocal] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getCurrencies();
        const list = res.data || res || [];
        setCurrencies(Array.isArray(list) ? list : []);
      } catch (e) {
        showError(e.response?.data?.message || 'Error al cargar monedas');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleConvert = async (e) => {
    e.preventDefault();
    setConverting(true);
    setResult(null);
    try {
      const data = await convertCurrency({
        fromCurrency: from,
        toCurrency: to,
        amount: Number(amount),
        preferLocal,
      });
      setResult(data);
    } catch (err) {
      showError(err.response?.data?.message || 'Error en conversión');
    } finally {
      setConverting(false);
    }
  };

  if (loading) return <Spinner />;

  const codes = currencies.length
    ? currencies.map((c) => c.code || c.currencyCode).filter(Boolean)
    : ['USD', 'EUR', 'GTQ'];

  return (
    <div className="max-w-xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-h)]">Conversión de divisas</h1>
        <p className="text-sm text-[var(--text-muted)]">Tasas locales con respaldo en API externa</p>
      </header>
      <form onSubmit={handleConvert} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-[var(--text-muted)]">Desde</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2">
              {codes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-[var(--text-muted)]">Hacia</label>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2">
              {codes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm text-[var(--text-muted)]">Monto</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full rounded-xl border px-4 py-2"
            required
          />
        </div>
        <button type="submit" disabled={converting} className="btn-primary w-full py-3 rounded-xl">
          {converting ? 'Convirtiendo…' : 'Convertir'}
        </button>
      </form>
      {result && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="text-sm text-emerald-900">
            {result.amount} {result.fromCurrency || from} →{' '}
            <strong>{result.convertedAmount} {result.toCurrency || to}</strong>
          </p>
          {result.rate != null && (
            <p className="text-xs text-emerald-800 mt-2">Tasa: {result.rate} ({result.source || 'local'})</p>
          )}
        </div>
      )}
    </div>
  );
};
