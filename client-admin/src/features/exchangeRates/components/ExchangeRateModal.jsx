import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';

import { Spinner } from '../../auth/components/Spinner';

import { showSuccess, showError } from '../../../shared/utils/toast';

import { useExchangeRateStore } from '../store/useExchangeRateStore';

export const ExchangeRateModal = ({
  isOpen,
  onClose,
  exchangeRate,
  currencies = [],
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    createExchangeRate,
    updateExchangeRate,
    loading,
  } = useExchangeRateStore();

  useEffect(() => {
    if (!isOpen) return;

    reset({
      fromCurrency: exchangeRate?.fromCurrency?._id || '',
      toCurrency: exchangeRate?.toCurrency?._id || '',
      rate: exchangeRate?.rate ?? '',
    });
  }, [exchangeRate, isOpen, reset]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);

    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const onSubmit = async (data) => {
    const payload = {
      fromCurrency: data.fromCurrency,
      toCurrency: data.toCurrency,
      rate: Number(data.rate),
    };

    try {
      if (exchangeRate?._id) {
        await updateExchangeRate(exchangeRate._id, payload);
        showSuccess('Tasa actualizada');
      } else {
        await createExchangeRate(payload);
        showSuccess('Tasa creada');
      }

      reset();
      onClose();
    } catch (error) {
      console.error(error);
      const apiErrors = error?.response?.data?.errors;
      const message = Array.isArray(apiErrors)
        ? apiErrors.map((e) => e.message).join(', ')
        : error?.response?.data?.message || 'Error al guardar tasa';
      showError(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-[30px] border border-[#d9ccb8] bg-[#f4ede2] shadow-[0_30px_70px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >

        {}
        <div className="border-b border-[#d9ccb8] p-6">
          <h2 className="text-2xl font-bold text-[#3f3528]">
            {exchangeRate ? 'Editar tasa' : 'Nueva tasa'}
          </h2>

          <p className="mt-1 text-sm text-[#7b6b57]">
            Administra tasas de cambio entre monedas
          </p>
        </div>

        {}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 p-6"
        >

          <Select
            label="Moneda origen"
            error={errors.fromCurrency?.message}
            {...register('fromCurrency', {
              required: 'La moneda origen es requerida',
            })}
          >
            <option value="">Selecciona moneda</option>
            {currencies.map((currency) => (
              <option key={currency._id} value={currency._id}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </Select>

          <Select
            label="Moneda destino"
            error={errors.toCurrency?.message}
            {...register('toCurrency', {
              required: 'La moneda destino es requerida',
            })}
          >
            <option value="">Selecciona moneda</option>
            {currencies.map((currency) => (
              <option key={currency._id} value={currency._id}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </Select>

          <Input
            type="number"
            step="0.0001"
            label="Tasa de cambio"
            placeholder="0.00"
            error={errors.rate?.message}
            {...register('rate', {
              required: 'La tasa es requerida',
              min: {
                value: 0,
                message: 'No puede ser negativa',
              },
            })}
          />

          {}
          <div className="flex justify-end gap-3 border-t border-[#d9ccb8] pt-5">

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
              {loading ? <Spinner small /> : 'Guardar'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};