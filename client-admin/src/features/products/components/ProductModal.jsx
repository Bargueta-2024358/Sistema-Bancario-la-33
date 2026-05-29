import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';

import { Spinner } from '../../auth/components/Spinner';
import { useSaveProduct } from '../hooks/useSaveProduct';
import { useProductStore } from '../store/useProductStore';

import { showSuccess, showError } from '../../../shared/utils/toast';

export const ProductModal = ({
  isOpen,
  onClose,
  product,
  currencies = [],
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { saveProduct } = useSaveProduct();
  const loading = useProductStore((s) => s.loading);

  useEffect(() => {
    if (!isOpen) return;

    reset({
      name: product?.name || '',
      description: product?.description || '',
      interestRate: product?.interestRate ?? '',
      currencyCode: product?.currency?.code || '',
    });
  }, [product, isOpen, reset]);

  const onSubmit = async (data) => {
    try {
      const selectedCurrency = currencies.find(
        (c) => c.code === data.currencyCode
      );

      const payload = {
        name: data.name,
        description: data.description,
        interestRate: Number(data.interestRate),
        currencyCode: data.currencyCode,
        currency: selectedCurrency?._id,
      };

      await saveProduct(payload, product?._id, currencies);

      showSuccess(product ? 'Producto actualizado' : 'Producto creado');

      reset();
      onClose();
    } catch (error) {
      const apiErrors = error?.response?.data?.errors;
      const message = Array.isArray(apiErrors)
        ? apiErrors.map((e) => e.message).join(', ')
        : error?.response?.data?.message || 'Error al guardar producto';
      showError(message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Editar producto' : 'Nuevo producto'}
      subtitle="Administra productos bancarios"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <Input
          label="Nombre"
          error={errors.name?.message}
          {...register('name', { required: 'El nombre es requerido' })}
        />

        <Input
          label="Descripción"
          error={errors.description?.message}
          {...register('description')}
        />

        <Input
          type="number"
          step="0.01"
          label="Tasa de interés"
          error={errors.interestRate?.message}
          {...register('interestRate', {
            required: 'La tasa es requerida',
            min: { value: 0, message: 'No puede ser negativa' },
          })}
        />

        <Select
          label="Moneda"
          error={errors.currencyCode?.message}
          {...register('currencyCode', {
            required: 'La moneda es requerida',
          })}
        >
          <option value="">Selecciona moneda</option>

          {currencies
            .filter((c) => c.isActive !== false)
            .map((c) => (
            <option key={c._id} value={c.code}>
              {c.symbol} {c.code} - {c.name}
            </option>
          ))}
        </Select>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#d9ccb8]">

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-[#d9ccb8] bg-white px-5 py-2 text-[#5f5342]"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="rounded-2xl bg-[#fada28] px-6 py-2 font-semibold text-[#3f3528]"
          >
            {loading ? <Spinner small /> : product ? 'Guardar' : 'Crear'}
          </button>

        </div>
      </form>
    </Modal>
  );
};