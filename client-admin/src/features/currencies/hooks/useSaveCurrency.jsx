import { useCurrencyStore } from '../store/useCurrencyStore';

export const useSaveCurrency = () => {
  const createCurrency =
    useCurrencyStore(
      (s) => s.createCurrency
    );

  const updateCurrency =
    useCurrencyStore(
      (s) => s.updateCurrency
    );

  const saveCurrency = async (
    data,
    id = null
  ) => {

    const payload = {
      code: data.code?.toUpperCase()?.trim(),
      name: data.name?.trim(),
      symbol: data.symbol?.trim(),
    };

    if (id) {
      return await updateCurrency(id, payload);
    }

    return await createCurrency(payload);
  };

  return {
    saveCurrency,
  };
};