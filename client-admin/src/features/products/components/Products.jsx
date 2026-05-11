import { useEffect, useState } from 'react';

import { useProductStore } from '../store/useProductStore';
import { ProductModal } from '../components/ProductModal';

import { Spinner } from '../../auth/components/Spinner';
import { useCurrencyStore } from '../../currencies/store/useCurrencyStore';
import { showError } from '../../../shared/utils/toast';

export const Products = () => {
  const {
    products,
    loading,
    error,
    getProducts,
    activateProduct,
    deactivateProduct,
  } = useProductStore();

  const { currencies, getCurrencies } = useCurrencyStore();

  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getProducts();
    getCurrencies();
  }, []);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  if (loading && products.length === 0) return <Spinner />;

  return (
    <div className="min-h-screen bg-[#e7dbcb] p-8">

      {/* HEADER */}
      <div className="mb-10 flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold text-[#3f3528]">
            Productos
          </h1>

          <p className="mt-2 text-sm text-[#7b6b57]">
            Administra productos bancarios del sistema
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedProduct(null);
            setOpenModal(true);
          }}
          className="rounded-2xl bg-[#fada28] px-6 py-3 font-semibold text-[#3f3528] shadow-[0_10px_25px_rgba(250,218,40,0.25)] transition hover:scale-[1.02]"
        >
          + Nuevo producto
        </button>
      </div>

      {/* GRID */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {products.map((product) => (
          <div
            key={product._id}
            className={`rounded-3xl border p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all ${
              product.isActive
                ? 'bg-[#f4ede2] border-[#d9ccb8]'
                : 'bg-[#efe3df] border-[#d8b4aa]'
            }`}
          >

            {/* HEADER */}
            <div className="flex items-start justify-between">

              <div>
                <h2 className="text-2xl font-bold text-[#3f3528]">
                  {product.name}
                </h2>

                <p className="mt-1 text-sm text-[#7b6b57] line-clamp-2">
                  {product.description || 'Sin descripción'}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  product.isActive
                    ? 'bg-[#fada28]/20 text-[#8a6a00]'
                    : 'bg-[#e7b7ac] text-[#6b2d22]'
                }`}
              >
                {product.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            {/* INFO */}
            <div className="mt-6 space-y-3">

              <div className="flex justify-between">
                <span className="text-[#7b6b57]">Tasa</span>
                <span className="font-semibold text-[#3f3528]">
                  {Number(product.interestRate || 0).toFixed(2)}%
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#7b6b57]">Moneda</span>
                <span className="font-semibold text-[#3f3528]">
                  {product.currency?.symbol} {product.currency?.code || 'N/A'}
                </span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex gap-3">

              <button
                onClick={() => {
                  setSelectedProduct(product);
                  setOpenModal(true);
                }}
                className="flex-1 rounded-2xl border border-[#d9ccb8] bg-white py-3 text-[#5f5342] transition hover:bg-[#fada28]/15"
              >
                Editar
              </button>

              {product.isActive ? (
                <button
                  onClick={() => deactivateProduct(product._id)}
                  className="flex-1 rounded-2xl bg-[#e7b7ac] py-3 text-[#6b2d22]"
                >
                  Desactivar
                </button>
              ) : (
                <button
                  onClick={() => activateProduct(product._id)}
                  className="flex-1 rounded-2xl bg-[#fada28] py-3 font-semibold text-[#3f3528]"
                >
                  Activar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <ProductModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        currencies={currencies}
      />
    </div>
  );
};