const express = require("express");
const router = express.Router();
const { getUserReport, getGlobalReport } = require("./report.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth-middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la transacción
 *         user_id:
 *           type: string
 *           description: ID del usuario
 *         account_number:
 *           type: string
 *           description: Número de cuenta
 *         type:
 *           type: string
 *           enum: [DEPOSIT, WITHDRAW]
 *           description: Tipo de transacción
 *         amount:
 *           type: number
 *           description: Monto de la transacción
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *     GlobalReport:
 *       type: object
 *       properties:
 *         totalDeposits:
 *           type: number
 *           description: Total de depósitos
 *         totalWithdraws:
 *           type: number
 *           description: Total de retiros
 *         systemBalance:
 *           type: number
 *           description: Balance del sistema
 */

/**
 * @swagger
 * /api/reports/user/{userId}:
 *   get:
 *     summary: Obtener reporte de usuario
 *     description: Recupera todas las transacciones de un usuario específico. Solo el propio usuario o un administrador pueden acceder.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Reporte de usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       403:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No autorizado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error obteniendo reporte"
 */
router.get("/user/:userId", verifyToken, getUserReport);

/**
 * @swagger
 * /api/reports/global:
 *   get:
 *     summary: Obtener reporte global
 *     description: Recupera estadísticas globales del sistema (total de depósitos, retiros y balance). Solo para administradores.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte global obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GlobalReport'
 *       403:
 *         description: No autorizado - requiere rol de administrador
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error reporte global"
 */
router.get("/global", verifyToken, isAdmin, getGlobalReport);

module.exports = router;