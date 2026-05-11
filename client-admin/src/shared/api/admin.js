import { axiosAdmin } from './api';

// RESTAURANTES

// OBTENER TODOS
export const getRestaurants = async () => {
  const { data } = await axiosAdmin.get('/restaurants');
  return data;
};

// OBTENER UNO
export const getRestaurantById = async (id) => {
  const { data } = await axiosAdmin.get(`/restaurants/${id}`);
  return data;
};

// CREAR
export const createRestaurant = async (data) => {
  return await axiosAdmin.post('/restaurants', data);
};

// ACTUALIZAR
export const updateRestaurant = async (id, data) => {
  return await axiosAdmin.put(`/restaurants/${id}`, data);
};

// ELIMINAR
export const deleteRestaurant = async (id) => {
  return await axiosAdmin.delete(`/restaurants/${id}`);
};

// PEDIDOS

// CREAR ORDEN
export const createOrder = async (data) => {
  return await axiosAdmin.post('/orders', data);
};

// OBTENER TODAS (ADMIN)
export const getOrders = async () => {
  const { data } = await axiosAdmin.get('/orders');
  return data;
};

// OBTENER MIS ÓRDENES (USER)
export const getMyOrders = async () => {
  const { data } = await axiosAdmin.get('/orders/my-orders');
  return data;
};

// OBTENER POR ID
export const getOrderById = async (id) => {
  const { data } = await axiosAdmin.get(`/orders/${id}`);
  return data;
};

// CONFIRMAR ORDEN
export const confirmOrder = async (id) => {
  const { data } = await axiosAdmin.patch(`/orders/${id}/confirm`);
  return data;
};

// ACTUALIZAR STATUS
export const updateOrderStatus = async (id, data) => {
  const { data: res } = await axiosAdmin.patch(
    `/orders/${id}/status`,
    data
  );
  return res;
};

// CANCELAR ORDEN
export const cancelOrder = async (id) => {
  const { data } = await axiosAdmin.patch(`/orders/${id}/cancel`);
  return data;
};

// =========================
// PRODUCTS
// =========================

// GET ALL
export const getProducts = async () => {
  const { data } = await axiosAdmin.get('/products');
  return data;
};

// GET BY ID
export const getProductById = async (id) => {
  const { data } = await axiosAdmin.get(`/products/${id}`);
  return data;
};

// CREATE
export const createProduct = async (payload) => {
  const { data } = await axiosAdmin.post(
    '/products',
    payload
  );

  return data;
};

// UPDATE
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

// ACTIVATE
export const activateProduct = async (
  id
) => {
  const { data } = await axiosAdmin.put(
    `/products/${id}/activate`
  );

  return data;
};

// DEACTIVATE
export const deactivateProduct = async (
  id
) => {
  const { data } = await axiosAdmin.put(
    `/products/${id}/deactivate`
  );

  return data;
};

// CURRENCIES

export const getCurrencies = async () => {
  const { data } = await axiosAdmin.get('/currencies');
  return data;
};

export const getCurrencyById = async (id) => {
  const { data } = await axiosAdmin.get(`/currencies/${id}`);
  return data;
};

export const createCurrency = async (payload) => {
  return await axiosAdmin.post('/currencies', payload);
};

export const updateCurrency = async (id, payload) => {
  return await axiosAdmin.put(`/currencies/${id}`, payload);
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

//
// ACCOUNT TYPES
//

export const getAccountTypes =
  async () => {
    const { data } =
      await axiosAdmin.get(
        '/accountTypes'
      );

    return data;
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

//
// EXCHANGE RATES
//

export const getExchangeRates =
  async () => {
    const { data } =
      await axiosAdmin.get(
        '/exchangeRates'
      );

    return data;
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