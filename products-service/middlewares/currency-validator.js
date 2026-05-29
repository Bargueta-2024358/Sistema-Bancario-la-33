import { body, param, query } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { requireRole } from './validate-role.js';
import { checkValidators } from './check-validators.js';

export const validateCreateCurrency = [ 
  validateJWT,               
  requireRole('ADMIN_ROLE'),       
  body('code')
    .trim()
    .notEmpty()
    .withMessage('El código es requerido')
    .isLength({ min: 2, max: 5 })
    .withMessage('El código debe tener entre 2 y 5 caracteres'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
  body('symbol')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('El símbolo no puede exceder 10 caracteres'),
  checkValidators,          
];

export const validateUpdateCurrency = [
  validateJWT,
  requireRole('ADMIN_ROLE'),
  param('id')
    .isMongoId()
    .withMessage('ID debe ser un ObjectId válido de MongoDB'),
  body('code')
    .optional()
    .trim()
    .isLength({ min: 2, max: 5 })
    .withMessage('El código debe tener entre 2 y 5 caracteres'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
  body('symbol')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('El símbolo no puede exceder 10 caracteres'),
  checkValidators,
];

export const validateCurrencyStatusChange = [
  validateJWT,
  requireRole('ADMIN_ROLE'),
  param('id')
    .isMongoId()
    .withMessage('ID debe ser un ObjectId válido de MongoDB'),
  checkValidators,
];

export const validateGetCurrencyById = [
  param('id')
    .isMongoId()
    .withMessage('ID debe ser un ObjectId válido de MongoDB'),
  checkValidators,
];

export const validateConvertCurrency = [
  query('fromCurrency')
    .notEmpty()
    .withMessage('fromCurrency es requerido')
    .isLength({ min: 3, max: 5 }),
  query('toCurrency')
    .notEmpty()
    .withMessage('toCurrency es requerido')
    .isLength({ min: 3, max: 5 }),
  query('amount')
    .notEmpty()
    .withMessage('amount es requerido')
    .isFloat({ gt: 0 })
    .withMessage('amount debe ser mayor a 0'),
  checkValidators,
];