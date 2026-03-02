import { body, param } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { requireRole } from './validate-role.js';
import { checkValidators } from './check-validators.js';

export const validateCreateExchangeRate = [
  validateJWT,
  requireRole('ADMIN_ROLE'),
body('fromCurrency')
  .notEmpty().withMessage('Moneda origen es requerida')
  .isMongoId().withMessage('Moneda origen inválida'),

body('toCurrency')
  .notEmpty().withMessage('Moneda destino es requerida')
  .isMongoId().withMessage('Moneda destino inválida'),
  body('rate')
    .notEmpty()
    .withMessage('La tasa de cambio es requerida')
    .isFloat({ gt: 0 })
    .withMessage('La tasa debe ser mayor a 0'),
  checkValidators,
];

export const validateUpdateExchangeRate = [
  validateJWT,
  requireRole('ADMIN_ROLE'),
  param('id').isMongoId().withMessage('ID debe ser un ObjectId válido'),
  body('fromCurrency').optional().trim().isLength({ min: 2, max: 5 }),
  body('toCurrency').optional().trim().isLength({ min: 2, max: 5 }),
  body('rate').optional().isFloat({ gt: 0 }),
  checkValidators,
];

export const validateExchangeRateStatusChange = [
  validateJWT,
  requireRole('ADMIN_ROLE'),
  param('id').isMongoId().withMessage('ID debe ser un ObjectId válido'),
  checkValidators,
];

export const validateGetExchangeRateById = [
  param('id').isMongoId().withMessage('ID debe ser un ObjectId válido'),
  checkValidators,
];