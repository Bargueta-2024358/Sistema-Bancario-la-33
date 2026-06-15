const express = require('express');
const {
  getHistory,
  getAccountStatement,
  exportAccountStatement,
  getFinancialReport,
  getStatistics,
  exportHistory,
  getGlobalReport,
  getUserReport,
} = require('../controllers/report.controller');
const { verifyToken, isAdmin } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyToken);


router.get('/history/:userId', getHistory);
router.get('/history/:userId/export', exportHistory);


router.get('/account-statement/:accountNumber', getAccountStatement);
router.get('/account-statement/:accountNumber/export', exportAccountStatement);

router.get('/financial/:userId', getFinancialReport);
router.get('/statistics/:userId', getStatistics);
router.get('/global', isAdmin, getGlobalReport);

router.get('/user/:userId', getUserReport);

module.exports = router;
