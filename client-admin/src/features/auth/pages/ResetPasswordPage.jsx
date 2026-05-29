import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import chitaLogo from '../../../assets/img/logo chita banco.png';
import { resetPassword } from '../../../shared/api/auth';

export const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get('token') || '';
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ password }) => {
    if (!token) {
      toast.error('Token inválido. Solicita un nuevo enlace.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({ token, newPassword: password });
      if (res?.success === false) {
        toast.error(res?.message || 'No se pudo actualizar la contraseña');
        return;
      }
      toast.success('Contraseña actualizada exitosamente');
      navigate('/auth');
    } catch (err) {
      toast.error(err.response?.data?.message || 'No se pudo actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e7dbcb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[520px] rounded-[28px] border border-[#e7dbcb] bg-[#e7dbcb] px-8 py-8 shadow-[0_30px_70px_rgba(0,0,0,0.12)]">
        <div className="mb-8 flex items-center justify-center gap-6">
          <img src={chitaLogo} alt="Banco La 33" className="h-24 w-auto" />
          <div className="text-center">
            <p className="text-4xl font-extrabold tracking-tight text-[#daa520] leading-[0.95]">Banco</p>
            <p className="text-4xl font-extrabold tracking-tight text-[#daa520] leading-[0.95]">La 33</p>
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-[#3f3528]">Restablecer contraseña</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#5f5342] mb-2">
              Nueva contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="Mínimo 8 caracteres"
              className="w-full rounded-2xl border border-[#e6dccd] bg-[#ffffff] py-3 px-4 text-sm text-[#3f3528] shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] focus:border-[#fada28] focus:outline-none focus:ring-2 focus:ring-[#fada28]/30"
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: { value: 8, message: 'Debe tener al menos 8 caracteres' },
              })}
            />
            {errors.password && <p className="text-red-600 text-xs mt-2">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#5f5342] mb-2">
              Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Repite la contraseña"
              className="w-full rounded-2xl border border-[#e6dccd] bg-[#ffffff] py-3 px-4 text-sm text-[#3f3528] shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] focus:border-[#fada28] focus:outline-none focus:ring-2 focus:ring-[#fada28]/30"
              {...register('confirmPassword', {
                required: 'Confirma tu contraseña',
                validate: (value) => value === watch('password') || 'Las contraseñas no coinciden',
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs mt-2">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#fada28] text-[#2f2a1d] font-semibold py-3 shadow-[0_12px_24px_rgba(250,218,40,0.28)] transition hover:opacity-95 disabled:opacity-60"
          >
            {loading ? 'Actualizando...' : 'Guardar nueva contraseña'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/auth" className="text-[#daa520] font-medium hover:underline">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};
