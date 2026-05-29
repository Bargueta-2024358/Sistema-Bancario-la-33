import { useEffect, useState } from 'react';

import {
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

import { Spinner } from '../../auth/components/Spinner';

import { showError } from '../../../shared/utils/toast';

import { useAccountTypeStore } from '../store/useAccountTypeStore';

import { AccountTypeModal } from '../components/AccountTypeModal';

export const AccountTypes = () => {
  const {
    accountTypes,
    loading,
    error,
    getAccountTypes,
    activateAccountType,
    deactivateAccountType,
  } = useAccountTypeStore();

  const [openModal, setOpenModal] =
    useState(false);

  const [selectedAccountType,
    setSelectedAccountType] =
    useState(null);

  useEffect(() => {
    getAccountTypes();
  }, []);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  if (loading) return <Spinner />;

  return (
      <div className="min-h-screen bg-[#e7dbcb] p-8">

        {/* HEADER */}
        <div className="mb-10 flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold text-[#3f3528]">
              Tipos de Cuenta
            </h1>

            <p className="mt-2 text-sm text-[#7b6b57]">
              Gestiona los tipos de cuenta del sistema
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedAccountType(null);
              setOpenModal(true);
            }}
            className="rounded-2xl bg-[#fada28] px-6 py-3 font-semibold text-[#3f3528] shadow-[0_10px_25px_rgba(250,218,40,0.28)] transition hover:scale-[1.02]"
          >
            Nuevo tipo
          </button>
        </div>

        {/* GRID */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {accountTypes.map((accountType) => (
            <div
              key={accountType._id}
              className={`rounded-3xl border p-6 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.05)] ${
                accountType.isActive
                  ? 'bg-[#f4ede2] border-[#d9ccb8]'
                  : 'bg-[#efe3df] border-[#d8b4aa]'
              }`}
            >

              {/* TOP */}
              <div className="flex items-start justify-between">

                <div>
                  <h2 className="text-2xl font-semibold text-[#3f3528]">
                    {accountType.name}
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-[#6f604d]">
                    {accountType.description || 'Sin descripción'}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    accountType.isActive
                      ? 'bg-[#fada28]/25 text-[#8a6a00]'
                      : 'bg-[#e7b7ac] text-[#8a3d2e]'
                  }`}
                >
                  {accountType.isActive
                    ? 'Activo'
                    : 'Desactivado'}
                </span>
              </div>

              {/* BODY */}
              <div className="mt-6 rounded-2xl bg-white/70 p-4 border border-[#e6dccd]">

                <p className="text-sm text-[#7b6b57]">
                  Tasa de interés
                </p>

                <p className="mt-1 text-2xl font-bold text-[#3f3528]">
                  {accountType.interestRate}%
                </p>
              </div>

              {/* ACTIONS */}
              <div className="mt-6 flex gap-3">

                <button
                  onClick={() => {
                    setSelectedAccountType(accountType);
                    setOpenModal(true);
                  }}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-[#d9ccb8] bg-white text-[#5f5342] transition hover:bg-[#fada28]/15"
                >
                  <PencilIcon className="h-4 w-4" />
                  Editar
                </button>

                {accountType.isActive ? (
                  <button
                    onClick={() =>
                      deactivateAccountType(accountType._id)
                    }
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#e7b7ac] text-[#6b2d22] transition hover:opacity-90"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Desactivar
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      activateAccountType(accountType._id)
                    }
                    className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-[#fada28] font-medium text-[#3f3528] transition hover:opacity-90"
                  >
                    Activar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        <AccountTypeModal
          isOpen={openModal}
          onClose={() => {
            setOpenModal(false);
            setSelectedAccountType(null);
          }}
          accountType={selectedAccountType}
        />
      </div>
    );
};