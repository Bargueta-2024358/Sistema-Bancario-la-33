import { useState } from 'react';
import { LoginForm } from '../components/LoginForm.jsx';
import { ForgotPassword } from '../components/ForgotPassword.jsx';
import { RegisterForm } from '../components/RegisterForm.jsx';
import chitaLogo from '../../../assets/img/logo chita banco.png';

export const AuthPage = () => {
  const [view, setView] = useState('login'); // 'login', 'forgot', 'register'

  const getTitle = () => {
    if (view === 'forgot') return 'Recuperar Contraseña';
    if (view === 'register') return 'Crear Cuenta';
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
              onRegister={() => setView('register')}
            />
          )}
          {view === 'forgot' && (
            <ForgotPassword onSwitch={() => setView('login')} />
          )}
          {view === 'register' && (
            <RegisterForm 
              onSwitch={() => setView('login')}
              onSuccess={() => setView('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

