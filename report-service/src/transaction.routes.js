const express = require("express");
const router = express.Router();
const { createTransaction } = require("./transaction.controller");

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Crear nueva transacción
 *     description: Registra una nueva transacción en el sistema bancario
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - accountNumber
 *               - type
 *               - amount
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario que realiza la transacción
 *               accountNumber:
 *                 type: string
 *                 description: Número de cuenta bancaria
 *               type:
 *                 type: string
 *                 enum: [DEPOSIT, WITHDRAW]
 *                 description: Tipo de transacción
 *               amount:
 *                 type: number
 *                 description: Monto de la transacción
 *     responses:
 *       201:
 *         description: Transacción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creando transacción"
 */
router.post("/", createTransaction);

module.exports = router;