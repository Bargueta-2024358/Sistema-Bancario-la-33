const express = require("express");
const router = express.Router();
const controller = require("../controllers/account.controller");
const roleMiddleware = require("../../middlewares/role.middleware");

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Crear una cuenta bancaria
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountType:
 *                 type: string
 *               ownerId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cuenta creada correctamente
 *       401:
 *         description: No autorizado
 */
router.post("/", roleMiddleware("ADMIN_ROLE"), controller.createAccount);

/**
 * @swagger
 * /api/accounts/{accountNumber}/deactivate:
 *   patch:
 *     summary: Desactivar una cuenta
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: accountNumber
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cuenta desactivada correctamente
 *       401:
 *         description: No autorizado
 */
router.patch("/:accountNumber/deactivate",
    roleMiddleware("ADMIN_ROLE"),
    controller.deactivateAccount
);

/**
 * @swagger
 * /api/accounts/{accountNumber}/deposit:
 *   post:
 *     summary: Depositar dinero en una cuenta
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: accountNumber
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Depósito realizado correctamente
 *       401:
 *         description: No autorizado
 */
router.post("/:accountNumber/deposit",
    roleMiddleware("USER_ROLE"),
    controller.deposit
);

/**
 * @swagger
 * /api/accounts/{accountNumber}/withdraw:
 *   post:
 *     summary: Retirar dinero de una cuenta
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: accountNumber
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Retiro realizado correctamente
 *       401:
 *         description: No autorizado
 */
router.post("/:accountNumber/withdraw",
    roleMiddleware("USER_ROLE"),
    controller.withdraw
);

/**
 * @swagger
 * /api/accounts/{accountNumber}/balance:
 *   get:
 *     summary: Obtener el saldo de una cuenta
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: accountNumber
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Saldo obtenido correctamente
 *       401:
 *         description: No autorizado
 */
router.get("/:accountNumber/balance",
    roleMiddleware("USER_ROLE"),
    controller.getBalance
);

/**
 * @swagger
 * /api/accounts/{accountNumber}/transactions:
 *   get:
 *     summary: Obtener transacciones de una cuenta
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: accountNumber
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transacciones listadas correctamente
 *       401:
 *         description: No autorizado
 */
router.get("/:accountNumber/transactions",
    roleMiddleware("USER_ROLE"),
    controller.getTransactions
);

module.exports = router;