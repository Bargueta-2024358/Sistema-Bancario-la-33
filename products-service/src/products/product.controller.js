import {
  fetchProducts,
  fetchProductById,
  createProductRecord,
  updateProductRecord,
  updateProductStatus,
} from './product.service.js';
import Product from './product.model.js';
import Currency from '../currencies/currency.model.js';

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive = true } = req.query;
    const { products, pagination } = await fetchProducts({
      page,
      limit,
      isActive,
    });

    res.status(200).json({
      success: true,
      data: products,
      pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los productos',
      error: error.message,
    });
  }
};

// Obtener producto por ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await fetchProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el producto',
      error: error.message,
    });
  }
};

// Crear producto
export const createProduct = async (req, res) => {
  try {
    const { name, description, currencyCode } = req.body;

    // Buscar la moneda por código
    const currencyDoc = await Currency.findOne({ code: currencyCode });
    if (!currencyDoc) {
      return res.status(400).json({
        success: false,
        message: `Moneda con código "${currencyCode}" no encontrada`,
      });
    }

    // Verificar duplicados
    const existing = await Product.findOne({
      name,
      currency: currencyDoc._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Ya existe un producto con nombre "${name}" y moneda "${currencyDoc.code}"`,
      });
    }

    // Crear producto usando el _id de la moneda
    const product = await createProductRecord({
      productData: {
        ...req.body,
        currency: currencyDoc._id, 
      },
    });

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear el producto',
      error: error.message,
    });
  }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await updateProductRecord({
      id,
      updateData: req.body,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el producto',
      error: error.message,
    });
  }
};

// Activar - Desactivar producto
export const changeProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const isActive = req.url.includes('/activate');
    const action = isActive ? 'activado' : 'desactivado';

    const product = await updateProductStatus({ id, isActive });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: `Producto ${action} exitosamente`,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado del producto',
      error: error.message,
    });
  }
};