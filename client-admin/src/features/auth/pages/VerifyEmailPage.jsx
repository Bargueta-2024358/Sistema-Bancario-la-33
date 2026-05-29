import { useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import chitaLogo from '../../../assets/img/logo chita banco.png';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get('token');

  const handleFinish = useCallback(() => {
    setTimeout(() => navigate('/auth'), 2500);
  }, [navigate]);

  const { status, message } = useVerifyEmail(token, handleFinish);

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e7dbcb] px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-[#e6dccd] bg-white p-8 shadow-[0_30px_70px_rgba(0,0,0,0.12)]">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={chitaLogo} alt="Banco La 33" className="mb-4 h-24 w-24 object-contain" />
          <p className="text-xs font-semibold uppercase tracking-widest text-[#daa520]">Banco La 33</p>
          <h1 className="mt-2 text-2xl font-bold text-[#3f3528]">Confirmación de correo</h1>
        </div>

        <div className="flex flex-col items-center text-center" aria-live="polite">
          {isLoading && (
            <>
              <ArrowPathIcon className="h-14 w-14 animate-spin text-[#daa520]" />
              <p className="mt-4 text-[#5f5342]">Verificando tu correo, espera un momento…</p>
            </>
          )}

          {isSuccess && (
            <>
              <CheckCircleIcon className="h-16 w-16 text-emerald-600" />
              <p className="mt-4 text-lg font-semibold text-[#3f3528]">¡Correo confirmado!</p>
              <p className="mt-2 text-sm text-[#7b6b57]">{message}</p>
            </>
          )}

          {isError && (
            <>
              <XCircleIcon className="h-16 w-16 text-red-500" />
              <p className="mt-4 text-lg font-semibold text-[#3f3528]">No se pudo confirmar</p>
              <p className="mt-2 text-sm text-[#7b6b57]">{message}</p>
            </>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {!isLoading && (
            <Link
              to="/auth?view=confirm"
              className="block w-full rounded-full bg-[#fada28] py-3 text-center font-semibold text-[#2f2a1d] shadow-[0_12px_24px_rgba(250,218,40,0.28)] hover:opacity-95"
            >
              Reenviar o confirmar manualmente
            </Link>
          )}
          <Link
            to="/auth"
            className="block w-full rounded-full border border-[#d9ccb8] py-3 text-center font-medium text-[#5f5342] hover:bg-[#faf6f0]"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};
