import { body, param } from 'express-validator';
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
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
  body('symbol')
    .trim()
    .notEmpty()
    .withMessage('El símbolo es requerido')
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