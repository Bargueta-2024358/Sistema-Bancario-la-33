import { useState } from 'react';
import { LoginForm } from '../components/LoginForm.jsx';
import { ForgotPassword } from '../components/ForgotPassword.jsx';
import chitaLogo from '../../../assets/img/logo chita banco.png';

export const AuthPage = () => {
  const [isForgot, setIsForgot] = useState(false);

  return (
    <div className='min-h-screen bg-[#e7dbcb] flex items-center justify-center px-4 py-10'>
      <div className='w-full max-w-lg rounded-[28px] border border-[#e7dbcb] bg-[#e7dbcb] px-10 py-10 shadow-[0_30px_70px_rgba(0,0,0,0.12)]'>
        <div className='mb-8 flex items-center justify-center gap-6'>
          <img src={chitaLogo} alt='Banco La 33' className='h-25 w-auto' />
          <div className='text-center'>
            <p className='text-4xl font-extrabold tracking-tight text-[#daa520] leading-[0.95]'>Banco</p>
            <p className='text-4xl font-extrabold tracking-tight text-[#daa520] leading-[0.95]'>La 33</p>
          </div>
        </div>

        <h1 className='mb-0 text-3xl font-semibold text-[#3f3528]'>Iniciar sesión</h1>

        <div className='mt-8'>
          {isForgot ? (
            <ForgotPassword onSwitch={() => setIsForgot(false)} />
          ) : (
            <LoginForm onForgot={() => setIsForgot(true)} />
          )}
        </div>
      </div>
    </div>
  );
};
