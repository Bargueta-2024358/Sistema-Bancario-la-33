//import toast from "react-hot-toast";
import React from 'react';
import { useUIStore } from '../store/uiStore';

/** Escucha `useUIStore().confirm` y muestra el diálogo (usado por openConfirm en toda la app). */
export const UiConfirmHost = () => {
  const confirm = useUIStore((s) => s.confirm);
  const closeConfirm = useUIStore((s) => s.closeConfirm);

  if (!confirm) return null;

  const handleCancel = () => {
    confirm.onCancel?.();
    closeConfirm();
  };

  const handleConfirm = async () => {
    try {
      await Promise.resolve(confirm.onConfirm?.());
    } finally {
      closeConfirm();
    }
  };

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4'>
      <div
        className='bg-[#fff8eb] p-6 rounded-[28px] w-full max-w-md text-center shadow-lg border border-[#f5e1b6]'
        role='dialog'
        aria-modal='true'
        aria-labelledby='ui-confirm-title'
      >
        <h2 id='ui-confirm-title' className='text-xl font-bold mb-2 text-[#3f3528]'>
          {confirm.title}
        </h2>
        <p className='mb-4 text-[#5f5342]'>{confirm.message}</p>
        <div className='flex justify-center gap-4 mt-4'>
          <button
            type='button'
            onClick={handleCancel}
            className='px-5 py-2 rounded-full bg-[#e6dccd] text-[#3f3528] font-medium hover:bg-[#ddd3c0] transition'
          >
            Cancelar
          </button>
          <button
            type='button'
            onClick={() => void handleConfirm()}
            className='px-5 py-2 rounded-full bg-[#fada28] text-[#2f2a1d] font-medium hover:opacity-95 transition'
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
{
  /* 
export const showConfirmToast = ({ title, message, onConfirm }) => {
  toast.custom((t) => (
    <div className="bg-white p-6 rounded-xl w-96 text-center shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="mb-4">{message}</p>
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            onConfirm?.();
            toast.dismiss(t.id);
          }}
          className="px-5 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
        >
          Confirmar
        </button>
      </div>
    </div>
  ));
};*/
}
