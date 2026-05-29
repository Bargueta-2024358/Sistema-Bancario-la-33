import { useProductStore } from '../store/useProductStore';

export const useSaveProduct = () => {
  const createProduct =
    useProductStore(
      (s) => s.createProduct
    );

  const updateProduct =
    useProductStore(
      (s) => s.updateProduct
    );

  const saveProduct = async (
    data,
    id = null,
    currencies = []
  ) => {

    const selectedCurrency =
      currencies.find(
        (c) =>
          c.code ===
          data.currencyCode
      );

    const payload = {
      name: data.name,
      description:
        data.description,

      interestRate: Number(
        data.interestRate || 0
      ),

      currencyCode:
        data.currencyCode,

      currency:
        selectedCurrency?._id,
    };

    if (id) {
      return await updateProduct(
        id,
        payload
      );
    }

    return await createProduct(
      payload
    );
  };

  return {
    saveProduct,
  };
};