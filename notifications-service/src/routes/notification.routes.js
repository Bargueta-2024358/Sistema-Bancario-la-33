const { Router } = require('express');
const auth = require('../../middlewares/auth.middleware');
const ctrl = require('../controllers/notification.controller');

const router = Router();


router.get('/', auth, ctrl.listNotifications);


router.get('/unread/count', auth, ctrl.unreadCount);

router.get('/:id', auth, ctrl.getNotification);
router.patch('/:id/read', auth, ctrl.markRead);

module.exports = router;
