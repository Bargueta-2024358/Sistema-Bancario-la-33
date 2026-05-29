import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Spinner } from '../../auth/components/Spinner.jsx';

export const EditUserModal = ({ isOpen, onClose, user, onSave, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (!isOpen || !user) return;
    reset({
      name: user.name || '',
      surname: user.surname || '',
      dpi: user.dpi || '',
      address: user.address || '',
      job: user.job || '',
      income: user.income ?? '',
      phone: user.phone || '',
      status: user.status !== false,
    });
  }, [isOpen, user, reset]);

  const submit = async (values) => {
    const ok = await onSave(user.id || user._id, values);
    if (ok) onClose();
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar usuario"
      subtitle={`@${user.username}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Nombre" error={errors.name?.message} {...register('name', { required: 'Requerido' })} />
            <Input label="Apellido" error={errors.surname?.message} {...register('surname', { required: 'Requerido' })} />
          </div>
          <Input label="Dirección" {...register('address')} />
          <Input label="Trabajo" {...register('job')} />
          <Input
            label="DPI"
            error={errors.dpi?.message}
            {...register('dpi', {
              pattern: { value: /^\d{13}$/, message: '13 dígitos' },
            })}
          />
          <Input label="Ingresos (Q)" type="number" step="0.01" {...register('income')} />
          <Input
            label="Teléfono"
            error={errors.phone?.message}
            {...register('phone', { pattern: { value: /^\d{8}$/, message: '8 dígitos' } })}
          />
          <label className="flex items-center gap-2 rounded-xl border border-[#d9ccb8] bg-white px-4 py-2.5 text-sm text-[#3f3528]">
            <input type="checkbox" {...register('status')} className="rounded" />
            Cuenta activa
          </label>
        </div>

        <div className="sticky bottom-0 -mx-6 -mb-6 mt-2 flex justify-end gap-3 border-t border-[#d9ccb8] bg-[#f4ede2] px-6 py-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner small /> : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
