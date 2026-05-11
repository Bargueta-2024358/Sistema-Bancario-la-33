import { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import { useSaveCurrency } from '../hooks/useSaveCurrency';

import { useCurrencyStore } from '../store/useCurrencyStore';

import { Spinner } from '../../auth/components/Spinner';

export const CurrencyModal = ({
  isOpen,
  onClose,
  currency,
}) => {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const { saveCurrency } =
    useSaveCurrency();

  const loading =
    useCurrencyStore(
      (s) => s.loading
    );

  useEffect(() => {
    if (!isOpen) return;

    reset({
      code:
        currency?.code || '',
    });
  }, [
    currency,
    isOpen,
    reset,
  ]);

  const onSubmit = async (
    data
  ) => {
    await saveCurrency(
      data,
      currency?._id
    );

    onClose();
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

        <div className="w-full max-w-lg overflow-hidden rounded-[30px] border border-[#d9ccb8] bg-[#f4ede2] shadow-[0_30px_70px_rgba(0,0,0,0.12)]">

          {/* HEADER */}
          <div className="border-b border-[#d9ccb8] p-6">

            <h2 className="text-2xl font-bold text-[#3f3528]">
              {currency ? 'Editar moneda' : 'Nueva moneda'}
            </h2>

            <p className="mt-1 text-sm text-[#7b6b57]">
              Usa códigos ISO como USD, EUR, GTQ
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 p-6"
          >

            {/* CODE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#5f5342]">
                Código ISO
              </label>

              <input
                {...register('code')}
                placeholder="Ej. USD"
                className="w-full rounded-2xl border border-[#e6dccd] bg-white px-4 py-3 text-[#3f3528] outline-none focus:border-[#fada28] focus:ring-2 focus:ring-[#fada28]/30"
              />
            </div>

            {/* PREVIEW */}
            {currency && (
              <div className="rounded-2xl border border-[#e6dccd] bg-white/70 p-4">

                <div className="flex justify-between">
                  <span className="text-[#7b6b57]">Nombre</span>
                  <span className="font-semibold text-[#3f3528]">
                    {currency.name}
                  </span>
                </div>

                <div className="mt-2 flex justify-between">
                  <span className="text-[#7b6b57]">Símbolo</span>
                  <span className="font-semibold text-[#3f3528]">
                    {currency.symbol}
                  </span>
                </div>
              </div>
            )}

            {/* ACTIONS */}
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
                className="rounded-2xl bg-[#fada28] px-6 py-2 font-semibold text-[#3f3528] shadow-[0_10px_25px_rgba(250,218,40,0.25)]"
              >
                {loading ? <Spinner small /> : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
};