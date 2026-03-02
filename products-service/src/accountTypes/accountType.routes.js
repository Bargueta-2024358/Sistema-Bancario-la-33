import { Router } from 'express';
import {
  createAccountType,
  updateAccountType,
  changeAccountTypeStatus,
  getAccountTypeById,
  getAccountTypes,
} from './accountType.controller.js';

import {
  validateCreateAccountType,
  validateUpdateAccountType,
  validateAccountTypeStatusChange,
  validateGetAccountTypeById,
} from '../../middlewares/accountType-validator.js';

const router = Router();

router.get('/', getAccountTypes);
router.get('/:id', validateGetAccountTypeById, getAccountTypeById);
router.post('/', validateCreateAccountType, createAccountType);
router.put('/:id', validateUpdateAccountType, updateAccountType);
router.put('/:id/activate', validateAccountTypeStatusChange, changeAccountTypeStatus);
router.put('/:id/deactivate', validateAccountTypeStatusChange, changeAccountTypeStatus);

export default router;