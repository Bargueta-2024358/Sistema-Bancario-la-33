const express = require('express');
const router = express.Router();
const controller = require('../controllers/account.controller');
const roleMiddleware = require('../../middlewares/role.middleware');

const ADMIN = ['ADMIN', 'ADMIN_ROLE'];
const CLIENT = ['CLIENT', 'USER_ROLE'];

// Rutas estáticas antes de parámetros dinámicos.
router.get('/my', roleMiddleware(...CLIENT), controller.getMyAccounts);
router.get('/top-movements', roleMiddleware(...ADMIN), controller.getTopAccounts);
router.get('/user/:userId/balance', roleMiddleware(...ADMIN), controller.getUserBalance);
router.post('/transactions/:transactionId/revert', roleMiddleware(...ADMIN), controller.revertTransaction);
router.post('/deposits/:transactionId/revert', roleMiddleware(...ADMIN), controller.revertDeposit);

// Endpoints de administración.
router.get('/', roleMiddleware(...ADMIN), controller.getAllAccounts);
router.post('/', roleMiddleware(...ADMIN), controller.createAccount);

// Endpoints por número de cuenta.
router.patch('/:accountNumber/deactivate', roleMiddleware(...ADMIN), controller.deactivateAccount);
router.post('/:accountNumber/admin-deposit', roleMiddleware(...ADMIN), controller.adminDeposit);
router.get('/:accountNumber/last-movements', roleMiddleware(...ADMIN), controller.getLastMovements);
router.post('/:accountNumber/transfer', roleMiddleware(...CLIENT), controller.transfer);
router.post('/:accountNumber/deposit', roleMiddleware(...CLIENT), controller.deposit);
router.post('/:accountNumber/withdraw', roleMiddleware(...CLIENT), controller.withdraw);
router.get('/:accountNumber/balance', roleMiddleware(...CLIENT), controller.getBalance);
router.get('/:accountNumber/transactions', roleMiddleware(...CLIENT), controller.getTransactions);

module.exports = router;
