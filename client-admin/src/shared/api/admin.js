import { axiosAdmin } from './api';
export const getRestaurants = async () => {
  const { data } = await axiosAdmin.get('/restaurants');
  return data;
};

export const getRestaurantById = async (id) => {
  const { data } = await axiosAdmin.get(`/restaurants/${id}`);
  return data;
};

export const createRestaurant = async (data) => {
  return await axiosAdmin.post('/restaurants', data);
};

export const updateRestaurant = async (id, data) => {
  return await axiosAdmin.put(`/restaurants/${id}`, data);
};

export const deleteRestaurant = async (id) => {
  return await axiosAdmin.delete(`/restaurants/${id}`);
};

export const createOrder = async (data) => {
  return await axiosAdmin.post('/orders', data);
};

export const getOrders = async () => {
  const { data } = await axiosAdmin.get('/orders');
  return data;
};

export const getMyOrders = async () => {
  const { data } = await axiosAdmin.get('/orders/my-orders');
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await axiosAdmin.get(`/orders/${id}`);
  return data;
};

export const confirmOrder = async (id) => {
  const { data } = await axiosAdmin.patch(`/orders/${id}/confirm`);
  return data;
};

export const updateOrderStatus = async (id, data) => {
  const { data: res } = await axiosAdmin.patch(
    `/orders/${id}/status`,
    data
  );
  return res;
};

export const cancelOrder = async (id) => {
  const { data } = await axiosAdmin.patch(`/orders/${id}/cancel`);
  return data;
};

export const getProducts = async (params = { limit: 100 }) => {
  const { data } = await axiosAdmin.get('/products', { params });
  return {
    ...data,
    data: data?.data ?? [],
  };
};

export const getProductById = async (id) => {
  const { data } = await axiosAdmin.get(`/products/${id}`);
  return data;
};

export const createProduct = async (payload) => {
  const { data } = await axiosAdmin.post(
    '/products',
    payload
  );

  return data;
};

export const updateProduct = async (
  id,
  payload
) => {
  const { data } = await axiosAdmin.put(
    `/products/${id}`,
    payload
  );

  return data;
};

export const activateProduct = async (
  id
) => {
  const { data } = await axiosAdmin.put(
    `/products/${id}/activate`
  );

  return data;
};

export const deactivateProduct = async (
  id
) => {
  const { data } = await axiosAdmin.put(
    `/products/${id}/deactivate`
  );

  return data;
};

export const getCurrencies = async (params = { limit: 100 }) => {
  const { data } = await axiosAdmin.get('/currencies', { params });
  return {
    ...data,
    data: data?.data ?? data?.currencies ?? [],
  };
};

export const getCurrencyById = async (id) => {
  const { data } = await axiosAdmin.get(`/currencies/${id}`);
  return data;
};

export const createCurrency = async (payload) => {
  const { data } = await axiosAdmin.post('/currencies', payload);
  return data;
};

export const updateCurrency = async (id, payload) => {
  const { data } = await axiosAdmin.put(`/currencies/${id}`, payload);
  return data;
};

export const activateCurrency = async (
  id
) => {
  const { data } =
    await axiosAdmin.put(
      `/currencies/${id}/activate`
    );

  return data;
};

export const deactivateCurrency = async (
  id
) => {
  const { data } =
    await axiosAdmin.put(
      `/currencies/${id}/deactivate`
    );

  return data;
};

export const getAccountTypes = async (params = { limit: 100 }) => {
  const { data } = await axiosAdmin.get('/accountTypes', { params });
  return {
    ...data,
    data: data?.data ?? data?.accountTypes ?? [],
  };
};

export const getAccountTypeById =
  async (id) => {
    const { data } =
      await axiosAdmin.get(
        `/accountTypes/${id}`
      );

    return data;
  };

export const createAccountType =
  async (payload) => {
    const { data } =
      await axiosAdmin.post(
        '/accountTypes',
        payload
      );

    return data;
  };

export const updateAccountType =
  async (id, payload) => {
    const { data } =
      await axiosAdmin.put(
        `/accountTypes/${id}`,
        payload
      );

    return data;
  };

export const activateAccountType =
  async (id) => {
    const { data } =
      await axiosAdmin.put(
        `/accountTypes/${id}/activate`
      );

    return data;
  };

export const deactivateAccountType =
  async (id) => {
    const { data } =
      await axiosAdmin.put(
        `/accountTypes/${id}/deactivate`
      );

    return data;
  };

export const getExchangeRates = async (params = { limit: 100 }) => {
  const { data } = await axiosAdmin.get('/exchangeRates', { params });
  return {
    ...data,
    data: data?.data ?? data?.exchangeRates ?? [],
  };
};

export const createExchangeRate =
  async (payload) => {
    const { data } =
      await axiosAdmin.post(
        '/exchangeRates',
        payload
      );

    return data;
  };

export const updateExchangeRate =
  async (id, payload) => {
    const { data } =
      await axiosAdmin.put(
        `/exchangeRates/${id}`,
        payload
      );

    return data;
  };

export const activateExchangeRate =
  async (id) => {
    const { data } =
      await axiosAdmin.put(
        `/exchangeRates/${id}/activate`
      );

    return data;
  };

export const deactivateExchangeRate =
  async (id) => {
    const { data } =
      await axiosAdmin.put(
        `/exchangeRates/${id}/deactivate`
      );

    return data;
  };

export const convertCurrency = async ({ fromCurrency, toCurrency, amount, preferLocal = false }) => {
  const { data } = await axiosAdmin.get('/currencies/convert', {
    params: { fromCurrency, toCurrency, amount, preferLocal },
  });
  return data.data || data;
};