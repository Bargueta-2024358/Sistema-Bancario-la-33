import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import chitaLogo from '../../../assets/img/logo chita banco.png';

export const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get('token');

  const handleFinish = useCallback(() => {
    // Esperar a que se perciba el toast antes de redirigir.
    setTimeout(() => navigate('/'), 2000);
  }, [navigate]);

  const { status, message } = useVerifyEmail(token, handleFinish);

  const displayMessage = status === 'loading' ? 'Verificando correo, por favor espera...' : message;

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-[#e7dbcb] px-4'>
      <img src={chitaLogo} alt='Banco La 33' className='w-32 h-32 object-contain mb-6' />

      <p className='text-lg font-semibold text-[#3f3528] text-center max-w-lg' aria-live='polite'>
        {displayMessage}
      </p>
    </div>
  );
};
