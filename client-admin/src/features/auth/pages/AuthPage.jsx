import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm.jsx';
import { ForgotPassword } from '../components/ForgotPassword.jsx';
import { ConfirmEmailPanel } from '../components/ConfirmEmailPanel.jsx';
import chitaLogo from '../../../assets/img/logo chita banco.png';

export const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState('login');
  const [pendingEmail, setPendingEmail] = useState('');

  useEffect(() => {
    if (searchParams.get('view') === 'register') {
      setView('login');
      setSearchParams({}, { replace: true });
      return;
    }

    if (searchParams.get('view') === 'confirm') {
      setView('confirm');
      const email = searchParams.get('email');
      if (email) setPendingEmail(email);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const getTitle = () => {
    if (view === 'forgot') return 'Recuperar Contraseña';
    if (view === 'confirm') return 'Confirmar correo';
    return 'Iniciar sesión';
  };

  return (
    <div className='min-h-screen bg-[#e7dbcb] flex items-center justify-center px-4 py-10'>
      <div className='w-full max-w-[550px] min-h-[300px] rounded-[28px] border border-[#e7dbcb] bg-[#e7dbcb] px-8 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.12)]'>
        <div className='mb-8 flex items-center justify-center gap-6'>
          <img src={chitaLogo} alt='Banco La 33' className='h-25 w-auto' />
          <div className='text-center'>
            <p className='text-4xl font-extrabold tracking-tight text-[#daa520] leading-[0.95]'>Banco</p>
            <p className='text-4xl font-extrabold tracking-tight text-[#daa520] leading-[0.95]'>La 33</p>
          </div>
        </div>

        <h1 className='mb-0 text-3xl font-semibold text-[#3f3528]'>{getTitle()}</h1>

        <div className='mt-8'>
          {view === 'login' && (
            <LoginForm
              onForgot={() => setView('forgot')}
            />
          )}
          {view === 'forgot' && (
            <ForgotPassword onSwitch={() => setView('login')} />
          )}
          {view === 'confirm' && (
            <ConfirmEmailPanel
              defaultEmail={pendingEmail}
              onSwitchLogin={() => setView('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

