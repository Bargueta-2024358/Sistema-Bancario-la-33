import Product from './product.model.js';
import eventBus from '../events/eventBus.js';

export const fetchProducts = async ({ page = 1, limit = 10 }) => {
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const products = await Product.find({ isActive: true })
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber)
    .sort({ createdAt: -1 })
    .populate('currency', 'code name symbol'); 

  const total = await Product.countDocuments({ isActive: true });

  return {
    products,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalRecords: total,
      limit: limitNumber,
    },
  };
};

export const fetchProductById = async (id) => {
  return Product.findById(id);
};

export const createProductRecord = async ({ productData }) => {
  const product = new Product(productData);
  await product.save();

  eventBus.emit('product.created', {
    id: product._id,
    name: product.name,
    price: product.price,
    currency: product.currency,
    createdAt: product.createdAt,
  });

  return product;
};

export const updateProductRecord = async ({ id, updateData }) => {
  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (product) {
    eventBus.emit('product.updated', {
      id: product._id,
      name: product.name,
      price: product.price,
      updatedAt: new Date(),
    });
  }

  return product;
};

export const updateProductStatus = async ({ id, isActive }) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { isActive },
    { new: true }
  );

  if (product && !isActive) {
    eventBus.emit('product.deactivated', {
      id: product._id,
      name: product.name,
      deactivatedAt: new Date(),
    });
  }

  return product;
};