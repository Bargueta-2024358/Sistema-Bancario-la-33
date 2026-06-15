const service = require('../services/notification.service');

const ok = (res, data, status = 200) =>
  res.status(status).json({ success: true, data });

const fail = (res, error) => {
  const status = error.statusCode || 400;
  res.status(status).json({
    success: false,
    message: error.message,
    error: error.code || 'NOTIFICATION_ERROR',
  });
};

exports.listNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await service.listByUser(userId, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    fail(res, error);
  }
};

exports.getNotification = async (req, res) => {
  try {
    const item = await service.getByIdForUser(req.params.id, req.user.id);
    ok(res, item);
  } catch (error) {
    fail(res, error);
  }
};

exports.markRead = async (req, res) => {
  try {
    const item = await service.markAsRead(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: 'Notificación marcada como leída', data: item });
  } catch (error) {
    fail(res, error);
  }
};

exports.unreadCount = async (req, res) => {
  try {
    const count = await service.countUnread(req.user.id);
    ok(res, { count });
  } catch (error) {
    fail(res, error);
  }
};


const requireFields = (body, fields) => {
  const missing = fields.filter((f) => body[f] === undefined || body[f] === null || body[f] === '');
  if (missing.length) {
    const err = new Error(`Campos requeridos: ${missing.join(', ')}`);
    err.statusCode = 400;
    err.code = 'VALIDATION_ERROR';
    throw err;
  }
};

exports.eventTransfer = async (req, res) => {
  try {
    requireFields(req.body, ['userId', 'amount', 'fromAccountNumber', 'toAccountNumber']);
    const notification = await service.notifyTransfer(req.body);
    res.status(201).json({ success: true, message: 'Notificación de transferencia creada', data: notification });
  } catch (error) {
    fail(res, error);
  }
};

exports.eventDeposit = async (req, res) => {
  try {
    requireFields(req.body, ['userId', 'amount', 'accountNumber']);
    const notification = await service.notifyDeposit(req.body);
    res.status(201).json({ success: true, message: 'Notificación de depósito creada', data: notification });
  } catch (error) {
    fail(res, error);
  }
};

exports.eventPasswordChanged = async (req, res) => {
  try {
    requireFields(req.body, ['userId']);
    const notification = await service.notifyPasswordChanged(req.body);
    res.status(201).json({ success: true, message: 'Notificación de contraseña creada', data: notification });
  } catch (error) {
    fail(res, error);
  }
};

exports.eventPasswordResetRequested = async (req, res) => {
  try {
    requireFields(req.body, ['userId']);
    const notification = await service.notifyPasswordResetRequested(req.body);
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    fail(res, error);
  }
};

exports.eventAlert = async (req, res) => {
  try {
    requireFields(req.body, ['userId', 'message']);
    const notification = await service.notifyAlert(req.body);
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    fail(res, error);
  }
};

exports.eventConfirmation = async (req, res) => {
  try {
    requireFields(req.body, ['userId', 'message']);
    const notification = await service.notifyConfirmation(req.body);
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    fail(res, error);
  }
};

exports.eventEmail = async (req, res) => {
  try {
    requireFields(req.body, ['userId', 'email', 'message']);
    const { userId, email, subject, message } = req.body;
    const notification = await service.sendCustomEmail({ userId, email, subject, message });
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    fail(res, error);
  }
};
