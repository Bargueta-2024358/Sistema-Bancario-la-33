import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

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
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!isOpen) return;
    reset();
  }, [isOpen, reset]);

  const submit = async (values) => {
    const formData = new FormData();

    formData.append('name', values.name);
    formData.append('surname', values.surname);
    formData.append('username', values.username);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('phone', values.phone);

    if (values.profilePicture?.[0]) {
      formData.append('profilePicture', values.profilePicture[0]);
    }

    const ok = await onCreate(formData);

    if (ok) {
      reset();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo usuario"
      subtitle="Completa la información para registrar un usuario"
    >
      <form onSubmit={handleSubmit(submit)} className="space-y-5">

        {/* NAME + SURNAME */}
        <div className="grid md:grid-cols-2 gap-4">

          <Input
            label="Nombre"
            placeholder="Juan"
            error={errors.name?.message}
            {...register('name', {
              required: 'El nombre es obligatorio',
            })}
          />

          <Input
            label="Apellido"
            placeholder="Pérez"
            error={errors.surname?.message}
            {...register('surname', {
              required: 'El apellido es obligatorio',
            })}
          />
        </div>

        {/* USER + PHONE */}
        <div className="grid md:grid-cols-2 gap-4">

          <Input
            label="Username"
            placeholder="juan123"
            error={errors.username?.message}
            {...register('username', {
              required: 'El username es obligatorio',
            })}
          />

          <Input
            label="Teléfono"
            placeholder="5555-5555"
            error={errors.phone?.message}
            {...register('phone', {
              required: 'El teléfono es obligatorio',
            })}
          />
        </div>

        {/* EMAIL */}
        <Input
          label="Email"
          placeholder="correo@ejemplo.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'El email es obligatorio',
          })}
        />

        {/* PASSWORD */}
        <div className="grid md:grid-cols-2 gap-4">

          <Input
            type="password"
            label="Contraseña"
            error={errors.password?.message}
            {...register('password', {
              required: 'La contraseña es obligatoria',
            })}
          />

          <Input
            type="password"
            label="Confirmar contraseña"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              validate: (v) =>
                v === getValues('password') ||
                'Las contraseñas no coinciden',
            })}
          />
        </div>

        {/* FILE */}
        <div>
          <label className="text-sm text-[var(--text-muted)]">
            Foto de perfil
          </label>

          <input
            type="file"
            {...register('profilePicture')}
            className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-h)]"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">
            {error}
          </p>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">

          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button type="submit" disabled={loading}>
            {loading ? <Spinner small /> : 'Crear usuario'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};