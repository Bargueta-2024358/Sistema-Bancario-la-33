import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore.js';
import toast from 'react-hot-toast';

export const RegisterForm = ({ onSwitch, onSuccess, onConfirmEmail }) => {
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('surname', data.surname);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('username', data.username);
    formData.append('phone', data.phone);

    if (data.profilePicture && data.profilePicture[0]) {
      formData.append('profilePicture', data.profilePicture[0]);
    }

    const res = await register(formData);
    if (res.success) {
      toast.success('¡Registro exitoso! Revisa tu correo para confirmar la cuenta.', { duration: 4000 });
      if (onSuccess) onSuccess(data.email);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4 sm:grid-cols-2'>
      {}
      <div>
        <label htmlFor='name' className='block text-sm font-medium text-[#5f5342] mb-2'>
          Nombre
        </label>
        <input
          type='text'
          id='name'
          placeholder='Tu nombre'
          className='w-full rounded-2xl border border-[#e6dccd] bg-[#ffffff] py-3 px-4 text-sm text-[#3f3528] shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] focus:border-[#fada28] focus:outline-none focus:ring-2 focus:ring-[#fada28]/30'
          {...registerField('name', { required: 'El nombre es obligatorio', maxLength: { value: 25, message: 'Máximo 25 caracteres' } })}
        />
        {errors.name && <p className='text-red-600 text-xs mt-2'>{errors.name.message}</p>}
      </div>

      {}
      <div>
        <label htmlFor='surname' className='block text-sm font-medium text-[#5f5342] mb-2'>
          Apellido
        </label>
        <input
          type='text'
          id='surname'
          placeholder='Tu apellido'
          className='w-full rounded-2xl border border-[#e6dccd] bg-[#ffffff] py-3 px-4 text-sm text-[#3f3528] shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] focus:border-[#fada28] focus:outline-none focus:ring-2 focus:ring-[#fada28]/30'
          {...registerField('surname', { required: 'El apellido es obligatorio', maxLength: { value: 25, message: 'Máximo 25 caracteres' } })}
        />
        {errors.surname && <p className='text-red-600 text-xs mt-2'>{errors.surname.message}</p>}
      </div>

      {}
      <div>
        <label htmlFor='username' className='block text-sm font-medium text-[#5f5342] mb-2'>
          Usuario
        </label>
        <input
          type='text'
          id='username'
          placeholder='Tu usuario'
          className='w-full rounded-2xl border border-[#e6dccd] bg-[#ffffff] py-3 px-4 text-sm text-[#3f3528] shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] focus:border-[#fada28] focus:outline-none focus:ring-2 focus:ring-[#fada28]/30'
          {...registerField('username', {
            required: 'El usuario es obligatorio',
            minLength: { value: 3, message: 'El usuario debe tener al menos 3 caracteres' },
          })}
        />
        {errors.username && <p className='text-red-600 text-xs mt-2'>{errors.username.message}</p>}
      </div>

      {}
      <div>
        <label htmlFor='phone' className='block text-sm font-medium text-[#5f5342] mb-2'>
          Teléfono
        </label>
        <input
          type='tel'
          id='phone'
          placeholder='Tu número de teléfono'
          className='w-full rounded-2xl border border-[#e6dccd] bg-[#ffffff] py-3 px-4 text-sm text-[#3f3528] shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] focus:border-[#fada28] focus:outline-none focus:ring-2 focus:ring-[#fada28]/30'
          {...registerField('phone', {
            required: 'El teléfono es obligatorio',
            pattern: {
              value: /^\d{8}$/,
              message: 'El teléfono debe tener exactamente 8 dígitos',
            },
          })}
        />
        {errors.phone && <p className='text-red-600 text-xs mt-2'>{errors.phone.message}</p>}
      </div>

      {}
      <div>
        <label htmlFor='email' className='block text-sm font-medium text-[#5f5342] mb-2'>
          Correo electrónico
        </label>
        <input
          type='email'
          id='email'
          placeholder='correo@example.com'
          className='w-full rounded-2xl border border-[#e6dccd] bg-[#ffffff] py-3 px-4 text-sm text-[#3f3528] shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] focus:border-[#fada28] focus:outline-none focus:ring-2 focus:ring-[#fada28]/30'
          {...registerField('email', {
            required: 'El email es obligatorio',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email inválido',
            },
          })}
        />
        {errors.email && <p className='text-red-600 text-xs mt-2'>{errors.email.message}</p>}
      </div>

      {}
      <div>
        <label htmlFor='password' className='block text-sm font-medium text-[#5f5342] mb-2'>
          Contraseña
        </label>
        <input
          type='password'
          id='password'
          placeholder='Contraseña segura'
          className='w-full rounded-2xl border border-[#e6dccd] bg-[#ffffff] py-3 px-4 text-sm text-[#3f3528] shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] focus:border-[#fada28] focus:outline-none focus:ring-2 focus:ring-[#fada28]/30'
          {...registerField('password', {
            required: 'La contraseña es obligatoria',
            minLength: { value: 8, message: 'La contraseña debe tener al menos 8 caracteres' },
          })}
        />
        {errors.password && <p className='text-red-600 text-xs mt-2'>{errors.password.message}</p>}
      </div>

      {}
      <div className='sm:col-span-2'>
        <label htmlFor='profilePicture' className='block text-sm font-medium text-[#5f5342] mb-2'>
          Imagen de perfil (opcional)
        </label>
        <input
          type='file'
          id='profilePicture'
          accept='image/*'
          className='w-full rounded-2xl border border-[#e6dccd] bg-[#ffffff] py-2 px-4 text-sm text-[#3f3528] shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] focus:border-[#fada28] focus:outline-none focus:ring-2 focus:ring-[#fada28]/30 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#fada28]/20 file:text-[#5f5342] hover:file:bg-[#fada28]/30'
          {...registerField('profilePicture')}
        />
      </div>

      {error && (
        <div className='sm:col-span-2'>
          <p className='text-red-600 text-sm text-center'>{error}</p>
        </div>
      )}

      <div className='sm:col-span-2 flex flex-wrap items-center justify-between gap-2 text-sm text-[#5f5342]'>
        <span>¿Ya te registraste?</span>
        <div className='flex flex-wrap gap-3'>
          <button
            type='button'
            onClick={onConfirmEmail}
            className='text-[#daa520] font-medium hover:underline'
          >
            Confirmar correo
          </button>
          <button
            type='button'
            onClick={onSwitch}
            className='text-[#daa520] font-medium hover:underline'
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>

      <button
        type='submit'
        disabled={loading}
        className='sm:col-span-2 w-full rounded-full bg-[#fada28] text-[#2f2a1d] font-semibold py-3 shadow-[0_12px_24px_rgba(250,218,40,0.28)] transition hover:opacity-95 disabled:opacity-60'
      >
        Registrarse
      </button>
    </form>
  );
};