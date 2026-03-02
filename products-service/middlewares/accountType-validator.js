import { body, param } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { requireRole } from './validate-role.js';
import { checkValidators } from './check-validators.js';

// Crear tipo de cuenta Solo admin
export const validateCreateAccountType = [
  validateJWT,
  requireRole('ADMIN_ROLE'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del tipo de cuenta es requerido')
    .isLength({ min: 2, max: 100 }),
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
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
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