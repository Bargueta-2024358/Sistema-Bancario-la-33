import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSaveCurrency } from '../hooks/useSaveCurrency';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { Spinner } from '../../auth/components/Spinner';
import { showError, showSuccess } from '../../../shared/utils/toast';

const CATALOG = {
  USD: { name: 'Dólar estadounidense', symbol: 'US$' },
  EUR: { name: 'Euro', symbol: '€' },
  GTQ: { name: 'Quetzal guatemalteco', symbol: 'Q' },
  MXN: { name: 'Peso mexicano', symbol: 'MX$' },
};

const CATALOG_CODES = Object.keys(CATALOG);

export const CurrencyModal = ({ isOpen, onClose, currency }) => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const { saveCurrency } = useSaveCurrency();
  const loading = useCurrencyStore((s) => s.loading);
  const getCurrencies = useCurrencyStore((s) => s.getCurrencies);
  const watchedCode = watch('code');

  useEffect(() => {
    if (!isOpen) return;

    const code = currency?.code || '';
    const meta = CATALOG[code] || {};

    reset({
      code,
      name: currency?.name || meta.name || '',
      symbol: currency?.symbol || meta.symbol || '',
    });
  }, [currency, isOpen, reset]);

  useEffect(() => {
    if (!isOpen || currency) return;
    const meta = CATALOG[watchedCode];
    if (meta) {
      reset((prev) => ({
        ...prev,
        name: meta.name,
        symbol: meta.symbol,
      }));
    }
  }, [watchedCode, isOpen, currency, reset]);

  const onSubmit = async (data) => {
    try {
      await saveCurrency(data, currency?._id);
      await getCurrencies();
      showSuccess(currency ? 'Moneda actualizada' : 'Moneda creada');
      onClose();
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      const message = Array.isArray(apiErrors)
        ? apiErrors.map((e) => e.message).join(', ')
        : err.response?.data?.message || 'Error al guardar moneda';
      showError(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-[30px] border border-[#d9ccb8] bg-[#f4ede2] shadow-[0_30px_70px_rgba(0,0,0,0.12)]">
        <div className="border-b border-[#d9ccb8] p-6">
          <h2 className="text-2xl font-bold text-[#3f3528]">
            {currency ? 'Editar moneda' : 'Nueva moneda'}
          </h2>
          <p className="mt-1 text-sm text-[#7b6b57]">
            {currency
              ? 'Actualiza nombre y símbolo. El código no cambia.'
              : 'Elige un código del catálogo (USD, EUR, GTQ, MXN)'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#5f5342]">Código ISO</label>
            {currency ? (
              <input
                readOnly
                {...register('code')}
                className="w-full rounded-2xl border border-[#e6dccd] bg-[#faf6f0] px-4 py-3 text-[#3f3528]"
              />
            ) : (
              <select
                {...register('code', { required: 'Selecciona un código' })}
                className="w-full rounded-2xl border border-[#e6dccd] bg-white px-4 py-3 text-[#3f3528] outline-none focus:border-[#fada28] focus:ring-2 focus:ring-[#fada28]/30"
              >
                <option value="">Selecciona moneda</option>
                {CATALOG_CODES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            )}
            {errors.code && <p className="mt-2 text-xs text-red-600">{errors.code.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5f5342]">Nombre</label>
            <input
              {...register('name', { required: 'El nombre es requerido' })}
              className="w-full rounded-2xl border border-[#e6dccd] bg-white px-4 py-3 text-[#3f3528] outline-none focus:border-[#fada28] focus:ring-2 focus:ring-[#fada28]/30"
            />
            {errors.name && <p className="mt-2 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#5f5342]">Símbolo</label>
            <input
              {...register('symbol', { required: 'El símbolo es requerido' })}
              className="w-full rounded-2xl border border-[#e6dccd] bg-white px-4 py-3 text-[#3f3528] outline-none focus:border-[#fada28] focus:ring-2 focus:ring-[#fada28]/30"
            />
            {errors.symbol && <p className="mt-2 text-xs text-red-600">{errors.symbol.message}</p>}
          </div>

          <div className="flex justify-end gap-3 border-t border-[#d9ccb8] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-[#d9ccb8] bg-white px-5 py-2 text-[#5f5342]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-[#fada28] px-6 py-2 font-semibold text-[#3f3528] shadow-[0_10px_25px_rgba(250,218,40,0.25)] disabled:opacity-60"
            >
              {loading ? <Spinner small /> : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
