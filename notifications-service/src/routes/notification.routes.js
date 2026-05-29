const { Router } = require('express');
const auth = require('../../middlewares/auth.middleware');
const ctrl = require('../controllers/notification.controller');

const router = Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Listar notificaciones del usuario autenticado
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', auth, ctrl.listNotifications);

/**
 * @swagger
 * /api/notifications/unread/count:
 *   get:
 *     summary: Contador de no leídas
 *     tags: [Notifications]
 */
router.get('/unread/count', auth, ctrl.unreadCount);

router.get('/:id', auth, ctrl.getNotification);
router.patch('/:id/read', auth, ctrl.markRead);

module.exports = router;
