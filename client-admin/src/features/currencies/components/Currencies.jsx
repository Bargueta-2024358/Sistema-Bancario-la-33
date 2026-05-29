import {
  useEffect,
  useState,
} from 'react';

import {
  TrashIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

import { useCurrencyStore } from '../store/useCurrencyStore';

import { CurrencyModal } from '../components/CurrencyModal';

import { Spinner } from '../../auth/components/Spinner';

import { showError } from '../../../shared/utils/toast';

export const Currencies = () => {
  const {
    currencies,
    loading,
    error,
    getCurrencies,
    activateCurrency,
    deactivateCurrency,
  } = useCurrencyStore();

  const [openModal, setOpenModal] =
    useState(false);

  const [
    selectedCurrency,
    setSelectedCurrency,
  ] = useState(null);

  useEffect(() => {
    getCurrencies();
  }, []);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  if (loading) {
    return <Spinner />;
  }

  return (
      <div className="min-h-screen bg-[#e7dbcb] p-8">

        {/* HEADER */}
        <div className="mb-10 flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold text-[#3f3528]">
              Monedas
            </h1>

            <p className="mt-2 text-sm text-[#7b6b57]">
              Gestiona las monedas del sistema
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCurrency(null);
              setOpenModal(true);
            }}
            className="rounded-2xl bg-[#fada28] px-6 py-3 font-semibold text-[#3f3528] shadow-[0_10px_25px_rgba(250,218,40,0.25)] transition hover:scale-[1.02]"
          >
            + Nueva moneda
          </button>
        </div>

        {/* GRID */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {currencies.map((currency) => (
            <div
              key={currency._id}
              className={`rounded-3xl border p-6 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.05)] ${
                currency.isActive
                  ? 'bg-[#f4ede2] border-[#d9ccb8]'
                  : 'bg-[#efe3df] border-[#d8b4aa]'
              }`}
            >

              {/* TOP */}
              <div className="flex items-start justify-between">

                <div>
                  <h2 className="text-3xl font-bold text-[#3f3528]">
                    {currency.code}
                  </h2>

                  <p className="mt-1 text-sm text-[#7b6b57]">
                    {currency.name}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">

                  {/* STATUS */}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      currency.isActive
                        ? 'bg-[#fada28]/20 text-[#8a6a00]'
                        : 'bg-[#e7b7ac] text-[#6b2d22]'
                    }`}
                  >
                    {currency.isActive ? 'Activa' : 'Inactiva'}
                  </span>

                  {/* BASE */}
                  {currency.isBase && (
                    <span className="rounded-lg bg-white px-2 py-1 text-xs text-[#5f5342] border border-[#d9ccb8]">
                      Base
                    </span>
                  )}
                </div>
              </div>

              {/* INFO */}
              <div className="mt-6 rounded-2xl bg-white/70 border border-[#e6dccd] p-4">

                <div className="flex justify-between">
                  <span className="text-[#7b6b57]">Símbolo</span>
                  <span className="font-semibold text-[#3f3528]">
                    {currency.symbol}
                  </span>
                </div>

                <div className="mt-2 flex justify-between">
                  <span className="text-[#7b6b57]">Estado</span>
                  <span className="font-semibold text-[#3f3528]">
                    {currency.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex gap-3">

                <button
                  onClick={() => {
                    setSelectedCurrency(currency);
                    setOpenModal(true);
                  }}
                  className="flex-1 rounded-2xl border border-[#d9ccb8] bg-white py-3 text-[#5f5342] transition hover:bg-[#fada28]/15"
                >
                  Editar
                </button>

                {currency.isActive ? (
                  <button
                    onClick={async () => {
                      try {
                        await deactivateCurrency(currency._id);
                      } catch (err) {
                        showError(err.response?.data?.message || 'No se pudo desactivar');
                      }
                    }}
                    className="flex-1 rounded-2xl bg-[#e7b7ac] py-3 text-[#6b2d22] transition hover:opacity-90"
                  >
                    Desactivar
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        await activateCurrency(currency._id);
                      } catch (err) {
                        showError(err.response?.data?.message || 'No se pudo activar');
                      }
                    }}
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
        <CurrencyModal
          isOpen={openModal}
          onClose={() => {
            setOpenModal(false);
            setSelectedCurrency(null);
          }}
          currency={selectedCurrency}
        />
      </div>
    );
};