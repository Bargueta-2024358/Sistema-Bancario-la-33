import { Router } from 'express';
import {
  createExchangeRate,
  updateExchangeRate,
  changeExchangeRateStatus,
  getExchangeRateById,
  getExchangeRates,
} from './exchangeRate.controller.js';

import {
  validateCreateExchangeRate,
  validateUpdateExchangeRate,
  validateExchangeRateStatusChange,
  validateGetExchangeRateById,
} from '../../middlewares/exchangeRate-validator.js';

const router = Router();

router.get('/', getExchangeRates);
router.get('/:id', validateGetExchangeRateById, getExchangeRateById);
router.post('/', validateCreateExchangeRate, createExchangeRate);
router.put('/:id', validateUpdateExchangeRate, updateExchangeRate);
router.put('/:id/activate', validateExchangeRateStatusChange, changeExchangeRateStatus);
router.put('/:id/deactivate', validateExchangeRateStatusChange, changeExchangeRateStatus);

export default router;