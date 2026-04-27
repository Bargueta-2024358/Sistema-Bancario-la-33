import { Router } from 'express';
import {
  getCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  changeCurrencyStatus,
} from './currency.controller.js';

import {
  validateCreateCurrency,
  validateUpdateCurrency,
  validateCurrencyStatusChange,
  validateGetCurrencyById,
} from '../../middlewares/currency-validator.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Currency:
 *       type: object
 *       required:
 *         - code
 *         - name
 *         - symbol
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único de la moneda
 *         code:
 *           type: string
 *           description: Código ISO de la moneda (ej. USD, EUR)
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: Nombre completo de la moneda
 *         symbol:
 *           type: string
 *           maxLength: 10
 *           description: Símbolo de la moneda (ej. $, €)
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Estado activo de la moneda
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
 * /BancoLa33/v1/currencies:
 *   get:
 *     summary: Obtener lista de monedas
 *     description: Recupera una lista de todas las monedas disponibles
 *     tags: [Currencies]
 *     responses:
 *       200:
 *         description: Lista de monedas obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Currency'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getCurrencies);

/**
 * @swagger
 * /BancoLa33/v1/currencies/{id}:
 *   get:
 *     summary: Obtener moneda por ID
 *     description: Recupera los detalles de una moneda específica por su ID
 *     tags: [Currencies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la moneda
 *     responses:
 *       200:
 *         description: Moneda encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Currency'
 *       404:
 *         description: Moneda no encontrada
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
router.get('/:id', validateGetCurrencyById, getCurrencyById);

/**
 * @swagger
 * /BancoLa33/v1/currencies:
 *   post:
 *     summary: Crear nueva moneda
 *     description: Crea una nueva moneda con validación de unicidad por código
 *     tags: [Currencies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - symbol
 *             properties:
 *               code:
 *                 type: string
 *                 description: Código ISO de la moneda
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 description: Nombre completo de la moneda
 *               symbol:
 *                 type: string
 *                 maxLength: 10
 *                 description: Símbolo de la moneda
 *     responses:
 *       201:
 *         description: Moneda creada exitosamente
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
 *                   example: "Moneda creada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Currency'
 *       400:
 *         description: Datos inválidos o moneda duplicada
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
router.post('/', validateCreateCurrency, createCurrency);

/**
 * @swagger
 * /BancoLa33/v1/currencies/{id}:
 *   put:
 *     summary: Actualizar moneda
 *     description: Actualiza los datos de una moneda existente
 *     tags: [Currencies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la moneda a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Nuevo código ISO de la moneda
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 description: Nuevo nombre de la moneda
 *               symbol:
 *                 type: string
 *                 maxLength: 10
 *                 description: Nuevo símbolo de la moneda
 *     responses:
 *       200:
 *         description: Moneda actualizada exitosamente
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
 *                   example: "Moneda actualizada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Currency'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Moneda no encontrada
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
router.put('/:id', validateUpdateCurrency, updateCurrency);

/**
 * @swagger
 * /BancoLa33/v1/currencies/{id}/activate:
 *   put:
 *     summary: Activar moneda
 *     description: Cambia el estado de una moneda a activo
 *     tags: [Currencies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la moneda a activar
 *     responses:
 *       200:
 *         description: Moneda activada exitosamente
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
 *                   example: "Moneda activada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Currency'
 *       404:
 *         description: Moneda no encontrada
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
router.put('/:id/activate', validateCurrencyStatusChange, changeCurrencyStatus);

/**
 * @swagger
 * /BancoLa33/v1/currencies/{id}/deactivate:
 *   put:
 *     summary: Desactivar moneda
 *     description: Cambia el estado de una moneda a inactivo
 *     tags: [Currencies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la moneda a desactivar
 *     responses:
 *       200:
 *         description: Moneda desactivada exitosamente
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
 *                   example: "Moneda desactivada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Currency'
 *       404:
 *         description: Moneda no encontrada
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
router.put('/:id/deactivate', validateCurrencyStatusChange, changeCurrencyStatus);

export default router;