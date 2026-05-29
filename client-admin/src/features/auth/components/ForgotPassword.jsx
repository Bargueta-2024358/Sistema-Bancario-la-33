import { useForm } from 'react-hook-form';
import { forgotPassword } from '../../../shared/api/auth';
import toast from 'react-hot-toast';
import { useState } from 'react';

export const ForgotPassword = ({ onSwitch }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      const res = await forgotPassword(email.trim());
      toast.success(res?.message || 'Si el correo existe, enviamos enlace de recuperación.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al solicitar recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      <div>
        <label htmlFor='email' className='block text-sm font-medium text-gray-800 mb-1.5'>
          Email
        </label>
        <input
          type='text'
          id='email'
          placeholder='Correo electrónico'
          className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
          {...register('email', {
            required: 'El email es obligatorio',
          })}
        />
        {errors.email && <p className='text-red-600 text-xs mt-1'>{errors.email.message}</p>}
      </div>
      <button
        type='submit'
        disabled={loading}
        className='w-full bg-[#fada28] hover:opacity-95 text-[#2f2a1d] font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm'
      >
        {loading ? 'Enviando...' : 'Recuperar Contraseña'}
      </button>
      <p className='text-center text-sm'>
        ¿Recordaste tu contraseña?{' '}
        <button
          type='button'
          onClick={onSwitch}
          className='text-[#daa520] hover:underline hover:cursor-pointer'
        >
          Iniciar Sesión
        </button>
      </p>
    </form>
  );
};
