const express = require('express');
const { createTransaction } = require('../controllers/transaction.controller');
const internal = require('../../middlewares/internal.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Registrar transacción (sync Banking)
 *     tags: [Transactions]
 */
router.post('/', internal, createTransaction);

module.exports = router;
