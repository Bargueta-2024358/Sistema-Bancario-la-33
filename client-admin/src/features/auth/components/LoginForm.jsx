import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore.js';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const LoginForm = ({ onForgot }) => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await login(data);
    if (res.success) {
      navigate('/dashboard');
      toast.success('¡Bienvenido a Kinal Sports Admin!', { duration: 2000 });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      <div className='mb-4'>
        <label htmlFor='emailOrUsername' className='block text-sm font-medium text-[#5f5342] mb-2'>
          
        </label>
        <div className='relative'>
          <span className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#b3a58a] text-lg'>✉️</span>
          <input
            type='text'
            id='emailOrUsername'
            placeholder='Correo electrónico o username'
            className='w-full rounded-2xl border border-[#e6dccd] bg-[#ffffff] py-3 pl-12 pr-4 text-sm text-[#3f3528] shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] focus:border-[#fada28] focus:outline-none focus:ring-2 focus:ring-[#fada28]/30'
            {...register('emailOrUsername', {
              required: 'El email o username es obligatorio',
            })}
          />
        </div>
        {errors.emailOrUsername && (
          <p className='text-red-600 text-xs mt-2'>{errors.emailOrUsername.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='password' className='block text-sm font-medium text-[#5f5342] mb-2'>
          
        </label>
        <div className='relative'>
          <span className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#b3a58a] text-lg'>🔒</span>
          <input
            type='password'
            id='password'
            placeholder='Contraseña'
            className='w-full rounded-2xl border border-[#e6dccd] bg-[#ffffff] py-3 pl-12 pr-4 text-sm text-[#3f3528] shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] focus:border-[#fada28] focus:outline-none focus:ring-2 focus:ring-[#fada28]/30'
            {...register('password', {
              required: 'La contraseña es obligatoria',
            })}
          />
        </div>
        {errors.password && (
          <p className='text-red-600 text-xs mt-2'>{errors.password.message}</p>
        )}
      </div>

      {error && <p className='text-red-600 text-sm text-center'>{error}</p>}

      <div className='flex items-center justify-between text-sm text-[#5f5342]'>
        <span className='text-[#5f5342]'>Ingresa tus credenciales para acceder de forma segura.</span>
        <button
          type='button'
          onClick={onForgot}
          className='text-[#daa520] font-medium hover:underline'
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <button
        type='submit'
        disabled={loading}
        className='w-full rounded-full bg-[#fada28] text-[#2f2a1d] font-semibold py-3 shadow-[0_12px_24px_rgba(250,218,40,0.28)] transition hover:opacity-95 disabled:opacity-60'
      >
        Iniciar Sesión
      </button>
    </form>
  );
};
