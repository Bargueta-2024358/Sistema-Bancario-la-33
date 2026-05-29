import { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import { Modal } from '../../../shared/components/ui/Modal';

import { Button } from '../../../shared/components/ui/Button';

import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';

const ACCOUNT_TYPE_NAMES = ['Ahorro', 'Monetaria', 'Crédito', 'Inversión'];

import { Spinner } from '../../auth/components/Spinner';

import {
  showSuccess,
  showError,
} from '../../../shared/utils/toast';

import { useAccountTypeStore } from '../store/useAccountTypeStore';

export const AccountTypeModal = ({
  isOpen,
  onClose,
  accountType,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    createAccountType,
    updateAccountType,
    loading,
  } = useAccountTypeStore();

  useEffect(() => {
    if (!isOpen) return;

    reset({
      name:
        accountType?.name || '',

      description:
        accountType?.description ||
        '',

      interestRate:
        accountType?.interestRate ??
        '',
    });
  }, [
    accountType,
    isOpen,
    reset,
  ]);

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      description: data.description || '',
      interestRate: Number(data.interestRate),
    };

    try {
      if (accountType?._id) {
        await updateAccountType(
          accountType._id,
          payload
        );

        showSuccess(
          'Tipo de cuenta actualizado'
        );
      } else {
        await createAccountType(
          payload
        );

        showSuccess(
          'Tipo de cuenta creado'
        );
      }

      reset();

      onClose();
    } catch (error) {
      console.error(error);

      const apiErrors = error?.response?.data?.errors;
      const message = Array.isArray(apiErrors)
        ? apiErrors.map((e) => e.message).join(', ')
        : error?.response?.data?.message || 'Error al guardar tipo de cuenta';
      showError(message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        accountType
          ? 'Editar Tipo'
          : 'Nuevo Tipo'
      }
      subtitle="Administra los tipos de cuenta"
    >
      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="space-y-5"
      >

        {/* NAME */}
        <Select
          label="Tipo de cuenta"
          error={errors.name?.message}
          {...register('name', {
            required: 'El tipo es requerido',
          })}
        >
          <option value="">Selecciona un tipo</option>
          {ACCOUNT_TYPE_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>

        {/* DESCRIPTION */}
        <Input
          label="Descripción"
          placeholder="Descripción del tipo de cuenta"
          error={
            errors.description
              ?.message
          }
          {...register(
            'description'
          )}
        />

        {/* INTEREST */}
        <Input
          type="number"
          step="0.01"
          label="Tasa de interés"
          placeholder="0.00"
          error={
            errors.interestRate
              ?.message
          }
          {...register(
            'interestRate',
            {
              required:
                'La tasa es requerida',

              min: {
                value: 0,
                message:
                  'La tasa no puede ser negativa',
              },
            }
          )}
        />

        {/* ACTIONS */}
       <div className="flex justify-end gap-3 pt-5 border-t border-[#d9ccb8]">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <Spinner small />
            ) : accountType ? (
              'Guardar'
            ) : (
              'Crear'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};