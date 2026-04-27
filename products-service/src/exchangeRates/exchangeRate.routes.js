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

/**
 * @swagger
 * components:
 *   schemas:
 *     ExchangeRate:
 *       type: object
 *       required:
 *         - fromCurrency
 *         - toCurrency
 *         - rate
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único de la tasa de cambio
 *         fromCurrency:
 *           $ref: '#/components/schemas/Currency'
 *           description: Moneda de origen
 *         toCurrency:
 *           $ref: '#/components/schemas/Currency'
 *           description: Moneda de destino
 *         rate:
 *           type: number
 *           minimum: 0
 *           description: Tasa de cambio entre las monedas
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Estado activo de la tasa de cambio
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 */

const router = Router();

/**
 * @swagger
 * /BancoLa33/v1/exchangeRates:
 *   get:
 *     summary: Obtener lista de tasas de cambio
 *     description: Recupera una lista de todas las tasas de cambio disponibles
 *     tags: [Exchange Rates]
 *     responses:
 *       200:
 *         description: Lista de tasas de cambio obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ExchangeRate'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getExchangeRates);

/**
 * @swagger
 * /BancoLa33/v1/exchangeRates/{id}:
 *   get:
 *     summary: Obtener tasa de cambio por ID
 *     description: Recupera los detalles de una tasa de cambio específica por su ID
 *     tags: [Exchange Rates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la tasa de cambio
 *     responses:
 *       200:
 *         description: Tasa de cambio encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ExchangeRate'
 *       404:
 *         description: Tasa de cambio no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', validateGetExchangeRateById, getExchangeRateById);

/**
 * @swagger
 * /BancoLa33/v1/exchangeRates:
 *   post:
 *     summary: Crear nueva tasa de cambio
 *     description: Crea una nueva tasa de cambio entre dos monedas
 *     tags: [Exchange Rates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromCurrency
 *               - toCurrency
 *               - rate
 *             properties:
 *               fromCurrency:
 *                 type: string
 *                 description: ID de la moneda de origen
 *               toCurrency:
 *                 type: string
 *                 description: ID de la moneda de destino
 *               rate:
 *                 type: number
 *                 minimum: 0
 *                 description: Tasa de cambio
 *     responses:
 *       201:
 *         description: Tasa de cambio creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Tasa de cambio creada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/ExchangeRate'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', validateCreateExchangeRate, createExchangeRate);

/**
 * @swagger
 * /BancoLa33/v1/exchangeRates/{id}:
 *   put:
 *     summary: Actualizar tasa de cambio
 *     description: Actualiza los datos de una tasa de cambio existente
 *     tags: [Exchange Rates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la tasa de cambio a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromCurrency:
 *                 type: string
 *                 description: Nuevo ID de la moneda de origen
 *               toCurrency:
 *                 type: string
 *                 description: Nuevo ID de la moneda de destino
 *               rate:
 *                 type: number
 *                 minimum: 0
 *                 description: Nueva tasa de cambio
 *     responses:
 *       200:
 *         description: Tasa de cambio actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Tasa de cambio actualizada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/ExchangeRate'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tasa de cambio no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', validateUpdateExchangeRate, updateExchangeRate);

/**
 * @swagger
 * /BancoLa33/v1/exchangeRates/{id}/activate:
 *   put:
 *     summary: Activar tasa de cambio
 *     description: Cambia el estado de una tasa de cambio a activo
 *     tags: [Exchange Rates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la tasa de cambio a activar
 *     responses:
 *       200:
 *         description: Tasa de cambio activada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Tasa de cambio activada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/ExchangeRate'
 *       404:
 *         description: Tasa de cambio no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id/activate', validateExchangeRateStatusChange, changeExchangeRateStatus);

/**
 * @swagger
 * /BancoLa33/v1/exchangeRates/{id}/deactivate:
 *   put:
 *     summary: Desactivar tasa de cambio
 *     description: Cambia el estado de una tasa de cambio a inactivo
 *     tags: [Exchange Rates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la tasa de cambio a desactivar
 *     responses:
 *       200:
 *         description: Tasa de cambio desactivada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Tasa de cambio desactivada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/ExchangeRate'
 *       404:
 *         description: Tasa de cambio no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id/deactivate', validateExchangeRateStatusChange, changeExchangeRateStatus);

export default router;