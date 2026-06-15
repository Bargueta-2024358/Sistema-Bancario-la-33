const { Router } = require('express');
const internal = require('../../middlewares/internal.middleware');
const ctrl = require('../controllers/notification.controller');

const router = Router();

router.use(internal);


router.post('/transfer', ctrl.eventTransfer);
router.post('/deposit', ctrl.eventDeposit);
router.post('/password-changed', ctrl.eventPasswordChanged);
router.post('/password-reset-requested', ctrl.eventPasswordResetRequested);
router.post('/alert', ctrl.eventAlert);
router.post('/confirmation', ctrl.eventConfirmation);
router.post('/email', ctrl.eventEmail);

module.exports = router;
