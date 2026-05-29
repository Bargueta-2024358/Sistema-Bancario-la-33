import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Spinner } from '../../auth/components/Spinner.jsx';

export const CreateUserModal = ({
  isOpen,
  onClose,
  onCreate,
  loading,
  error,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: 'USER_ROLE',
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    reset({ role: 'USER_ROLE' });
  }, [isOpen, reset]);

  const submit = async (values) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name.trim());
      formData.append('surname', values.surname.trim());
      formData.append('username', values.username.trim());
      formData.append('email', values.email.trim().toLowerCase());
      formData.append('password', values.password);
      formData.append('phone', values.phone.replace(/\D/g, ''));
      formData.append('role', values.role || 'USER_ROLE');
      formData.append('dpi', values.dpi.replace(/\D/g, ''));
      formData.append('address', values.address.trim());
      formData.append('job', values.job.trim());
      formData.append('income', String(Number(values.income) || 0));

      if (values.profilePicture?.[0]) {
        formData.append('profilePicture', values.profilePicture[0]);
      }

      const ok = await onCreate(formData);
      if (ok) {
        reset({ role: 'USER_ROLE' });
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const busy = loading || submitting;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo usuario"
      subtitle="El cliente quedará activo de inmediato (sin verificación por email)"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Input
              label="Nombre"
              placeholder="Juan"
              error={errors.name?.message}
              {...register('name', { required: 'El nombre es obligatorio' })}
            />
            <Input
              label="Apellido"
              placeholder="Pérez"
              error={errors.surname?.message}
              {...register('surname', { required: 'El apellido es obligatorio' })}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <Input
              label="Usuario"
              placeholder="juanperez"
              error={errors.username?.message}
              {...register('username', { required: 'El usuario es obligatorio' })}
            />
            <Input
              label="Teléfono"
              placeholder="50212345"
              error={errors.phone?.message}
              {...register('phone', {
                required: 'El teléfono es obligatorio',
                pattern: {
                  value: /^\d{8}$/,
                  message: 'Debe tener exactamente 8 dígitos',
                },
              })}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <Input
              label="DPI"
              placeholder="13 dígitos"
              error={errors.dpi?.message}
              {...register('dpi', {
                required: 'El DPI es obligatorio',
                pattern: {
                  value: /^\d{13}$/,
                  message: 'Debe tener exactamente 13 dígitos',
                },
              })}
            />
            <Input
              label="Ingresos mensuales (Q)"
              type="number"
              step="0.01"
              min="0"
              error={errors.income?.message}
              {...register('income', {
                required: 'Los ingresos son obligatorios',
                min: { value: 0, message: 'No puede ser negativo' },
              })}
            />
          </div>

          <Input
            label="Dirección"
            placeholder="Dirección de residencia"
            error={errors.address?.message}
            {...register('address', { required: 'La dirección es obligatoria' })}
          />

          <Input
            label="Trabajo"
            placeholder="Nombre del trabajo"
            error={errors.job?.message}
            {...register('job', { required: 'El trabajo es obligatorio' })}
          />

          <Input
            label="Email"
            placeholder="correo@ejemplo.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'El email es obligatorio',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email inválido',
              },
            })}
          />

          <div className="grid sm:grid-cols-2 gap-3">
            <Input
              type="password"
              label="Contraseña"
              error={errors.password?.message}
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: { value: 8, message: 'Mínimo 8 caracteres' },
              })}
            />
            <Input
              type="password"
              label="Confirmar"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                validate: (v) =>
                  v === getValues('password') || 'Las contraseñas no coinciden',
              })}
            />
          </div>

          <div>
            <label className="text-sm text-[#7b6b57]">Rol</label>
            <select
              {...register('role')}
              className="mt-1 w-full rounded-xl border border-[#d9ccb8] bg-white px-4 py-2.5 text-[#3f3528] outline-none focus:ring-2 focus:ring-[#fada28]/50"
            >
              <option value="USER_ROLE">Cliente</option>
              <option value="ADMIN_ROLE">Administrador</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-[#7b6b57]">Foto de perfil (opcional)</label>
            <input
              type="file"
              accept="image/*"
              {...register('profilePicture')}
              className="mt-1 w-full rounded-xl border border-[#d9ccb8] bg-white px-3 py-2 text-sm text-[#3f3528] file:mr-3 file:rounded-lg file:border-0 file:bg-[#fada28] file:px-3 file:py-1 file:text-[#3f3528]"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 text-center">
              {error}
            </p>
          )}
        </div>

        <div className="sticky bottom-0 -mx-6 -mb-6 mt-2 flex shrink-0 justify-end gap-3 border-t border-[#d9ccb8] bg-[#f4ede2] px-6 py-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>
            Cancelar
          </Button>
          <Button type="submit" disabled={busy} className="min-w-[130px]">
            {busy ? <Spinner small /> : 'Crear usuario'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
