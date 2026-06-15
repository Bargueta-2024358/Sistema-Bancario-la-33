import { body, param } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { requireRole } from './validate-role.js';
import { checkValidators } from './check-validators.js';

export const validateCreateAccountType = [
  validateJWT,
  requireRole('ADMIN_ROLE'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del tipo de cuenta es requerido')
    .isIn(['Ahorro', 'Monetaria', 'Crédito', 'Inversión'])
    .withMessage('Nombre de tipo de cuenta inválido'),
  body('interestRate')
    .notEmpty()
    .withMessage('La tasa de interés es requerida')
    .isFloat({ min: 0 })
    .withMessage('La tasa debe ser >= 0'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }),
  checkValidators,
];

export const validateUpdateAccountType = [
  validateJWT,
  requireRole('ADMIN_ROLE'),
  param('id').isMongoId().withMessage('ID debe ser un ObjectId válido'),
  body('name').optional().trim().isIn(['Ahorro', 'Monetaria', 'Crédito', 'Inversión']),
  body('interestRate').optional().isFloat({ min: 0 }),
  body('description').optional().trim().isLength({ max: 500 }),
  checkValidators,
];

export const validateAccountTypeStatusChange = [
  validateJWT,
  requireRole('ADMIN_ROLE'),
  param('id').isMongoId().withMessage('ID debe ser un ObjectId válido'),
  checkValidators,
];

export const validateGetAccountTypeById = [
  param('id').isMongoId().withMessage('ID debe ser un ObjectId válido'),
  checkValidators,
];