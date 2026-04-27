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

/**
 * @swagger
 * components:
 *   schemas:
 *     AccountType:
 *       type: object
 *       required:
 *         - name
 *         - interestRate
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del tipo de cuenta
 *         name:
 *           type: string
 *           enum: [Ahorro, Monetaria, Crédito, Inversión]
 *           maxLength: 100
 *           description: Nombre del tipo de cuenta
 *         interestRate:
 *           type: number
 *           minimum: 0
 *           description: Tasa de interés del tipo de cuenta
 *         description:
 *           type: string
 *           maxLength: 300
 *           description: Descripción del tipo de cuenta
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Estado activo del tipo de cuenta
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
 * /BancoLa33/v1/accountTypes:
 *   get:
 *     summary: Obtener lista de tipos de cuenta
 *     description: Recupera una lista de todos los tipos de cuenta disponibles
 *     tags: [Account Types]
 *     responses:
 *       200:
 *         description: Lista de tipos de cuenta obtenida exitosamente
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
 *                     $ref: '#/components/schemas/AccountType'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAccountTypes);

/**
 * @swagger
 * /BancoLa33/v1/accountTypes/{id}:
 *   get:
 *     summary: Obtener tipo de cuenta por ID
 *     description: Recupera los detalles de un tipo de cuenta específico por su ID
 *     tags: [Account Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del tipo de cuenta
 *     responses:
 *       200:
 *         description: Tipo de cuenta encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AccountType'
 *       404:
 *         description: Tipo de cuenta no encontrado
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
router.get('/:id', validateGetAccountTypeById, getAccountTypeById);

/**
 * @swagger
 * /BancoLa33/v1/accountTypes:
 *   post:
 *     summary: Crear nuevo tipo de cuenta
 *     description: Crea un nuevo tipo de cuenta con validación de unicidad por nombre
 *     tags: [Account Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - interestRate
 *             properties:
 *               name:
 *                 type: string
 *                 enum: [Ahorro, Monetaria, Crédito, Inversión]
 *                 description: Nombre del tipo de cuenta
 *               interestRate:
 *                 type: number
 *                 minimum: 0
 *                 description: Tasa de interés
 *               description:
 *                 type: string
 *                 maxLength: 300
 *                 description: Descripción del tipo de cuenta
 *     responses:
 *       201:
 *         description: Tipo de cuenta creado exitosamente
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
 *                   example: "Tipo de cuenta creado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/AccountType'
 *       400:
 *         description: Datos inválidos o tipo de cuenta duplicado
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
router.post('/', validateCreateAccountType, createAccountType);

/**
 * @swagger
 * /BancoLa33/v1/accountTypes/{id}:
 *   put:
 *     summary: Actualizar tipo de cuenta
 *     description: Actualiza los datos de un tipo de cuenta existente
 *     tags: [Account Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del tipo de cuenta a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 enum: [Ahorro, Monetaria, Crédito, Inversión]
 *                 description: Nuevo nombre del tipo de cuenta
 *               interestRate:
 *                 type: number
 *                 minimum: 0
 *                 description: Nueva tasa de interés
 *               description:
 *                 type: string
 *                 maxLength: 300
 *                 description: Nueva descripción del tipo de cuenta
 *     responses:
 *       200:
 *         description: Tipo de cuenta actualizado exitosamente
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
 *                   example: "Tipo de cuenta actualizado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/AccountType'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tipo de cuenta no encontrado
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
router.put('/:id', validateUpdateAccountType, updateAccountType);

/**
 * @swagger
 * /BancoLa33/v1/accountTypes/{id}/activate:
 *   put:
 *     summary: Activar tipo de cuenta
 *     description: Cambia el estado de un tipo de cuenta a activo
 *     tags: [Account Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del tipo de cuenta a activar
 *     responses:
 *       200:
 *         description: Tipo de cuenta activado exitosamente
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
 *                   example: "Tipo de cuenta activado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/AccountType'
 *       404:
 *         description: Tipo de cuenta no encontrado
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
router.put('/:id/activate', validateAccountTypeStatusChange, changeAccountTypeStatus);

/**
 * @swagger
 * /BancoLa33/v1/accountTypes/{id}/deactivate:
 *   put:
 *     summary: Desactivar tipo de cuenta
 *     description: Cambia el estado de un tipo de cuenta a inactivo
 *     tags: [Account Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del tipo de cuenta a desactivar
 *     responses:
 *       200:
 *         description: Tipo de cuenta desactivado exitosamente
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
 *                   example: "Tipo de cuenta desactivado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/AccountType'
 *       404:
 *         description: Tipo de cuenta no encontrado
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
router.put('/:id/deactivate', validateAccountTypeStatusChange, changeAccountTypeStatus);

export default router;