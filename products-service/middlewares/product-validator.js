import { body, param } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { requireRole } from './validate-role.js';
import { checkValidators } from './check-validators.js';

export const validateCreateProduct = [
  validateJWT,
  requireRole('ADMIN_ROLE'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del producto es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  body('price')
    .notEmpty()
    .withMessage('El precio es requerido')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser mayor o igual a 0'),
  body('currencyCode')
    .notEmpty()
    .withMessage('El código de moneda es requerido')
    .isLength({ min: 2, max: 5 })
    .withMessage('Código de moneda inválido'),
  checkValidators,
];

export const validateUpdateProduct = [
  validateJWT,
  requireRole('ADMIN_ROLE'),
  param('id').isMongoId().withMessage('ID debe ser un ObjectId válido'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('price').optional().isFloat({ min: 0 }),
  body('currencyCode').optional().isLength({ min: 2, max: 5 }),
  checkValidators,
];

export const validateProductStatusChange = [
  validateJWT,
  requireRole('ADMIN_ROLE'),
  param('id').isMongoId().withMessage('ID debe ser un ObjectId válido'),
  checkValidators,
];

export const validateGetProductById = [
  param('id').isMongoId().withMessage('ID debe ser un ObjectId válido'),
  checkValidators,
];