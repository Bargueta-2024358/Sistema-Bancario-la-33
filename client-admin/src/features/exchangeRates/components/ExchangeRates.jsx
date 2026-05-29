import { useEffect, useState } from 'react';

import { Spinner } from '../../auth/components/Spinner';
import { showError } from '../../../shared/utils/toast';

import {
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

import { useExchangeRateStore } from '../store/useExchangeRateStore';
import { useCurrencyStore } from '../../currencies/store/useCurrencyStore';

import { ExchangeRateModal } from '../components/ExchangeRateModal';

export const ExchangeRates = () => {
  const {
    exchangeRates,
    loading,
    error,
    getExchangeRates,
    activateExchangeRate,
    deactivateExchangeRate,
  } = useExchangeRateStore();

  const { currencies, getCurrencies } =
    useCurrencyStore();

  const [openModal, setOpenModal] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);

  useEffect(() => {
    getExchangeRates();
    getCurrencies();
  }, []);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  if (loading && (!exchangeRates || exchangeRates.length === 0)) return <Spinner />;

  return (
    <div className="min-h-screen bg-[#e7dbcb] p-8">

      {/* HEADER */}
      <div className="mb-10 flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold text-[#3f3528]">
            Tasas de Cambio
          </h1>

          <p className="mt-2 text-sm text-[#7b6b57]">
            Gestiona las tasas de cambio del sistema
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedRate(null);
            setOpenModal(true);
          }}
          className="rounded-2xl bg-[#fada28] px-6 py-3 font-semibold text-[#3f3528] shadow-[0_10px_25px_rgba(250,218,40,0.25)] transition hover:scale-[1.02]"
        >
          Nueva tasa
        </button>
      </div>

      {/* GRID */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {(exchangeRates || []).map((rate) => (
          <div
            key={rate._id}
            className={`rounded-3xl border p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all ${
              rate.isActive
                ? 'bg-[#f4ede2] border-[#d9ccb8]'
                : 'bg-[#efe3df] border-[#d8b4aa]'
            }`}
          >

            {/* HEADER */}
            <div className="flex items-start justify-between">

              <div>
                <h2 className="text-2xl font-bold text-[#3f3528]">
                  {rate.fromCurrency?.code} → {rate.toCurrency?.code}
                </h2>

                <p className="mt-1 text-sm text-[#7b6b57]">
                  {rate.fromCurrency?.name} → {rate.toCurrency?.name}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  rate.isActive
                    ? 'bg-[#fada28]/20 text-[#8a6a00]'
                    : 'bg-[#e7b7ac] text-[#6b2d22]'
                }`}
              >
                {rate.isActive ? 'Activa' : 'Desactivada'}
              </span>
            </div>

            {/* BODY */}
            <div className="mt-6 rounded-2xl border border-[#e6dccd] bg-white/70 p-4">

              <p className="text-sm text-[#7b6b57]">
                Tasa de cambio
              </p>

              <p className="mt-1 text-2xl font-bold text-[#3f3528]">
                {rate.rate}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex gap-3">

              <button
                onClick={() => {
                  setSelectedRate(rate);
                  setOpenModal(true);
                }}
                className="flex-1 rounded-2xl border border-[#d9ccb8] bg-white py-3 text-[#5f5342] transition hover:bg-[#fada28]/15"
              >
                Editar
              </button>

              {rate.isActive ? (
                <button
                  onClick={() => deactivateExchangeRate(rate._id)}
                  className="flex-1 rounded-2xl bg-[#e7b7ac] py-3 text-[#6b2d22] transition hover:opacity-90"
                >
                  Desactivar
                </button>
              ) : (
                <button
                  onClick={() => activateExchangeRate(rate._id)}
                  className="flex-1 rounded-2xl bg-[#fada28] py-3 font-semibold text-[#3f3528] transition hover:opacity-90"
                >
                  Activar
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* MODAL */}
      <ExchangeRateModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedRate(null);
        }}
        exchangeRate={selectedRate}
        currencies={currencies}
      />
    </div>
  );
};