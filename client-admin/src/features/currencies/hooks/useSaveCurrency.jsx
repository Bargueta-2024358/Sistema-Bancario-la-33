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
    // EL BACKEND USA CATÁLOGO MAESTRO
    // SOLO NECESITA EL CODE

    const payload = {
      code:
        data.code?.toUpperCase(),
    };

    if (id) {
      return await updateCurrency(
        id,
        payload
      );
    }

    return await createCurrency(
      payload
    );
  };

  return {
    saveCurrency,
  };
};