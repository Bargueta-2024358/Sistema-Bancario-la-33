import { useExchangeRateStore } from '../store/useExchangeRateStore';

export const useSaveExchangeRate =
  () => {
    const {
      createExchangeRate,
      updateExchangeRate,
    } =
      useExchangeRateStore();

    const saveExchangeRate =
      async (
        data,
        id = null
      ) => {
        if (id) {
          await updateExchangeRate(
            id,
            data
          );
        } else {
          await createExchangeRate(
            data
          );
        }
      };

    return {
      saveExchangeRate,
    };
  };