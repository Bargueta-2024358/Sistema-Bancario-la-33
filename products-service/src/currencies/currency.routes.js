import { Router } from 'express';
import {
  getCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  changeCurrencyStatus,
  getExternalRates,
  convertCurrency,
} from './currency.controller.js';

import {
  validateCreateCurrency,
  validateUpdateCurrency,
  validateCurrencyStatusChange,
  validateGetCurrencyById,
  validateConvertCurrency,
} from '../../middlewares/currency-validator.js';



const router = Router();


router.get('/', getCurrencies);


router.get('/external-rates', getExternalRates);


router.get('/convert', validateConvertCurrency, convertCurrency);


router.get('/:id', validateGetCurrencyById, getCurrencyById);


router.post('/', validateCreateCurrency, createCurrency);


router.put('/:id', validateUpdateCurrency, updateCurrency);


router.put('/:id/activate', validateCurrencyStatusChange, changeCurrencyStatus);


router.put('/:id/deactivate', validateCurrencyStatusChange, changeCurrencyStatus);

export default router;