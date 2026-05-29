import { Router } from 'express';
import {
  createProduct,
  updateProduct,
  changeProductStatus,
  getProductById,
  getProducts,
} from './product.controller.js';

import {
  validateCreateProduct,
  validateUpdateProduct,
  validateProductStatusChange,
  validateGetProductById,
} from '../../middlewares/product-validator.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - interestRate
 *         - currency
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del producto
 *         name:
 *           type: string
 *           maxLength: 100
 *           description: Nombre del producto bancario
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Descripción detallada del producto
 *         interestRate:
 *           type: number
 *           minimum: 0
 *           description: Tasa de interés del producto
 *         currency:
 *           $ref: '#/components/schemas/Currency'
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Estado activo del producto
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     Currency:
 *       type: object
 *       required:
 *         - name
 *         - code
 *         - symbol
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único de la moneda
 *         name:
 *           type: string
 *           description: Nombre completo de la moneda
 *         code:
 *           type: string
 *           description: Código ISO de la moneda (ej. USD, EUR)
 *         symbol:
 *           type: string
 *           description: Símbolo de la moneda (ej. $, €)
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Estado activo de la moneda
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           description: Página actual
 *         limit:
 *           type: integer
 *           description: Límite de elementos por página
 *         total:
 *           type: integer
 *           description: Total de elementos
 *         pages:
 *           type: integer
 *           description: Total de páginas
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           description: Mensaje de error
 *         error:
 *           type: string
 *           description: Detalles del error
 */

const router = Router();

/**
 * @swagger
 * /BancoLa33/v1/products:
 *   get:
 *     summary: Obtener lista de productos bancarios
 *     description: Recupera una lista paginada de productos bancarios con filtros opcionales
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número máximo de productos por página
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Filtrar solo productos activos
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getProducts);

/**
 * @swagger
 * /BancoLa33/v1/products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     description: Recupera los detalles de un producto bancario específico por su ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del producto
 *     responses:
 *       200:
 *         description: Producto encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
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
router.get('/:id', validateGetProductById, getProductById);

/**
 * @swagger
 * /BancoLa33/v1/products:
 *   post:
 *     summary: Crear nuevo producto bancario
 *     description: Crea un nuevo producto bancario con validación de unicidad por nombre y moneda
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - interestRate
 *               - currencyCode
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 description: Nombre del producto
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Descripción del producto
 *               interestRate:
 *                 type: number
 *                 minimum: 0
 *                 description: Tasa de interés
 *               currencyCode:
 *                 type: string
 *                 description: Código ISO de la moneda (ej. USD, EUR)
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
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
 *                   example: "Producto creado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos inválidos o producto duplicado
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
router.post('/', validateCreateProduct, createProduct);

/**
 * @swagger
 * /BancoLa33/v1/products/{id}:
 *   put:
 *     summary: Actualizar producto bancario
 *     description: Actualiza los datos de un producto bancario existente
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 description: Nuevo nombre del producto
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Nueva descripción del producto
 *               interestRate:
 *                 type: number
 *                 minimum: 0
 *                 description: Nueva tasa de interés
 *               currencyCode:
 *                 type: string
 *                 description: Nuevo código ISO de la moneda
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
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
 *                   example: "Producto actualizado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Producto no encontrado
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
router.put('/:id', validateUpdateProduct, updateProduct);

/**
 * @swagger
 * /BancoLa33/v1/products/{id}/activate:
 *   put:
 *     summary: Activar producto bancario
 *     description: Cambia el estado de un producto a activo
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del producto a activar
 *     responses:
 *       200:
 *         description: Producto activado exitosamente
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
 *                   example: "Producto activado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
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
router.put('/:id/activate', validateProductStatusChange, changeProductStatus);

/**
 * @swagger
 * /BancoLa33/v1/products/{id}/deactivate:
 *   put:
 *     summary: Desactivar producto bancario
 *     description: Cambia el estado de un producto a inactivo
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del producto a desactivar
 *     responses:
 *       200:
 *         description: Producto desactivado exitosamente
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
 *                   example: "Producto desactivado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
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
router.put('/:id/deactivate', validateProductStatusChange, changeProductStatus);

export default router;