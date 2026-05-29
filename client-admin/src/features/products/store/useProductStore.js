import { create } from 'zustand';

import {
  getProducts,
  createProduct,
  updateProduct,
  activateProduct,
  deactivateProduct,
} from '../../../shared/api/admin';

export const useProductStore = create(
  (set, get) => ({
    products: [],
    loading: false,
    error: null,

    // GET
    getProducts: async () => {
      try {
        set({
          loading: true,
          error: null,
        });

        const res =
          await getProducts();

        set({
          products:
            res?.data || [],
          loading: false,
        });
      } catch (error) {
        console.error(error);

        const message =
          error.response?.data?.message ||
          (error.response?.status === 429
            ? 'Demasiadas peticiones al servicio de productos. Espera un momento e intenta de nuevo.'
            : 'Error al obtener productos');

        set({
          error: message,
          loading: false,
        });
      }
    },

    // CREATE
    createProduct: async (
      payload
    ) => {
      try {
        set({
          loading: true,
          error: null,
        });

        const res =
          await createProduct(
            payload
          );

        const newProduct = res?.data ?? res;

        set({
          products: [
            newProduct,
            ...get().products,
          ],

          loading: false,
        });

        return newProduct;
      } catch (error) {
        console.error(error);

        set({
          error:
            'Error al crear producto',
          loading: false,
        });

        throw error;
      }
    },

    // UPDATE
    updateProduct: async (
      id,
      payload
    ) => {
      try {
        set({
          loading: true,
          error: null,
        });

        const res =
          await updateProduct(
            id,
            payload
          );

        const updated =
          res?.data;

        set({
          products:
            get().products.map(
              (product) =>
                product._id === id
                  ? updated
                  : product
            ),

          loading: false,
        });

        return updated;
      } catch (error) {
        console.error(error);

        set({
          error:
            'Error al actualizar producto',
          loading: false,
        });

        throw error;
      }
    },

    // ACTIVATE
    activateProduct: async (id) => {
      try {
        await activateProduct(id);

        set({
          products: get().products.map(
            (product) =>
              product._id === id
                ? {
                    ...product,
                    isActive: true,
                  }
                : product
          ),
        });
      } catch (error) {
        console.error(error);

        set({
          error:
            'Error al activar producto',
        });
      }
    },

    // DEACTIVATE
    deactivateProduct: async (id) => {
      try {
        await deactivateProduct(id);

        set({
          products: get().products.map(
            (product) =>
              product._id === id
                ? {
                    ...product,
                    isActive: false,
                  }
                : product
          ),
        });
      } catch (error) {
        console.error(error);

        set({
          error:
            'Error al desactivar producto',
        });
      }
    },
  })
);