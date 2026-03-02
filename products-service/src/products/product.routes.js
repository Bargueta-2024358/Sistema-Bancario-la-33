import { Router } from 'express';
import {
  createProduct,
  updateProduct,
  changeProductStatus,
  getProductById,
  getProducts,
} from './product.controller.js';

import {
  validateCreateProduct,
  validateUpdateProduct,
  validateProductStatusChange,
  validateGetProductById,
} from '../../middlewares/product-validator.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', validateGetProductById, getProductById);
router.post('/', validateCreateProduct, createProduct);
router.put('/:id', validateUpdateProduct, updateProduct);
router.put('/:id/activate', validateProductStatusChange, changeProductStatus);
router.put('/:id/deactivate', validateProductStatusChange, changeProductStatus);

export default router;