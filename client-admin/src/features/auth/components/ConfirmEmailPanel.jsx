import { useState } from 'react';
import { resendVerificationEmail } from '../../../shared/api/auth';
import toast from 'react-hot-toast';
import { Spinner } from './Spinner';

export const ConfirmEmailPanel = ({ defaultEmail = '', onSwitchLogin }) => {
  const [resendLoading, setResendLoading] = useState(false);
  const [resendEmail, setResendEmail] = useState(defaultEmail);

  const handleResend = async () => {
    const email = resendEmail?.trim();
    if (!email) {
      toast.error('Ingresa tu correo para reenviar el código.');
      return;
    }

    setResendLoading(true);
    try {
      const res = await resendVerificationEmail(email);
      if (res?.success) {
        toast.success('Te enviamos un nuevo correo de confirmación. Revisa tu bandeja.');
      } else {
        toast.error(res?.message || 'No se pudo reenviar el correo');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al reenviar el correo');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#e6dccd] bg-[#faf6f0] p-4 text-sm text-[#5f5342]">
        <p className="font-medium text-[#3f3528]">Reenviar correo de verificación</p>
        <p className="mt-1 text-[#7b6b57]">
          Ingresa tu correo para enviarte nuevamente el enlace y código de verificación.
        </p>
      </div>

      <div className="space-y-4 border-t border-[#e6dccd] pt-4">
        <div>
          <label htmlFor="resend-email" className="mb-2 block text-sm font-medium text-[#5f5342]">
            Correo electrónico
          </label>
          <input
            id="resend-email"
            type="email"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            className="w-full rounded-2xl border border-[#e6dccd] bg-white py-3 px-4 text-sm text-[#3f3528] focus:border-[#fada28] focus:outline-none focus:ring-2 focus:ring-[#fada28]/30"
          />
        </div>
        <button
          type="button"
          disabled={resendLoading}
          onClick={handleResend}
          className="w-full rounded-full bg-[#fada28] py-3 font-semibold text-[#2f2a1d] shadow-[0_12px_24px_rgba(250,218,40,0.28)] transition hover:opacity-95 disabled:opacity-60"
        >
          {resendLoading ? <Spinner small /> : 'Reenviar código de verificación'}
        </button>
      </div>

      <div className="flex justify-center text-sm">
        <button type="button" onClick={onSwitchLogin} className="font-medium text-[#daa520] hover:underline">
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
};
