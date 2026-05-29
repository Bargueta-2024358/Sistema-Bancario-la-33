const Notification = require('../models/notification.model');
const { NOTIFICATION_TYPES } = require('../constants/notificationTypes');
const { sendEmail } = require('./email.service');
const NotificationError = require('../utils/NotificationError');

const createNotification = async ({
  userId,
  type,
  title,
  message,
  email = null,
  emailSubject = null,
  sendMail = false,
  metadata = {},
}) => {
  if (!userId || !type || !title || !message) {
    throw new NotificationError('userId, type, title y message son requeridos');
  }

  let emailResult = { sent: false, simulated: false };
  if (sendMail && email) {
    emailResult = await sendEmail({
      to: email,
      subject: emailSubject || title,
      text: message,
    });
  }

  const notification = await Notification.create({
    userId: String(userId),
    type,
    title,
    message,
    email,
    emailSubject: emailSubject || title,
    emailSent: emailResult.sent,
    emailSimulated: emailResult.simulated,
    metadata: { ...metadata, emailError: emailResult.error || null },
  });

  return notification;
};

const notifyTransfer = async (payload) => {
  const {
    userId,
    email,
    amount,
    fromAccountNumber,
    toAccountNumber,
    direction = 'OUT',
  } = payload;

  const isOut = direction === 'OUT';
  const title = isOut ? 'Transferencia enviada' : 'Transferencia recibida';
  const message = isOut
    ? `Transferiste Q${amount} de ${fromAccountNumber} a ${toAccountNumber}.`
    : `Recibiste Q${amount} en ${toAccountNumber} desde ${fromAccountNumber}.`;

  return createNotification({
    userId,
    type: NOTIFICATION_TYPES.TRANSFER,
    title,
    message,
    email,
    emailSubject: title,
    sendMail: Boolean(email),
    metadata: { fromAccountNumber, toAccountNumber, amount, direction },
  });
};

const notifyDeposit = async (payload) => {
  const { userId, email, amount, accountNumber, source = 'SELF' } = payload;

  const isAdminDeposit = source === 'ADMIN';
  const title = isAdminDeposit ? 'Depósito recibido del banco' : 'Depósito realizado';
  const message = isAdminDeposit
    ? `Se acreditó un depósito de Q${amount} en tu cuenta ${accountNumber}.`
    : `Realizaste un depósito de Q${amount} en tu cuenta ${accountNumber}.`;

  return createNotification({
    userId,
    type: NOTIFICATION_TYPES.DEPOSIT,
    title,
    message,
    email,
    emailSubject: title,
    sendMail: Boolean(email),
    metadata: { amount, accountNumber, source },
  });
};

const notifyPasswordChanged = async ({ userId, email, userName }) => {
  const title = 'Contraseña actualizada';
  const message = `Hola ${userName || 'usuario'}, tu contraseña fue cambiada correctamente. Si no fuiste tú, contacta soporte.`;

  return createNotification({
    userId,
    type: NOTIFICATION_TYPES.PASSWORD_CHANGE,
    title,
    message,
    email,
    emailSubject: title,
    sendMail: Boolean(email),
    metadata: { userName },
  });
};

const notifyPasswordResetRequested = async ({ userId, email }) => {
  const title = 'Solicitud de recuperación de contraseña';
  const message =
    'Recibimos una solicitud para restablecer tu contraseña. Si no la solicitaste, ignora este mensaje.';

  return createNotification({
    userId,
    type: NOTIFICATION_TYPES.PASSWORD_CHANGE,
    title,
    message,
    email,
    emailSubject: title,
    sendMail: Boolean(email),
    metadata: { action: 'reset_requested' },
  });
};

const notifyAlert = async ({ userId, email, title, message, severity = 'info' }) => {
  return createNotification({
    userId,
    type: NOTIFICATION_TYPES.ALERT,
    title: title || 'Alerta del sistema',
    message: message || 'Nueva alerta',
    email,
    emailSubject: title || 'Alerta Banco La 33',
    sendMail: Boolean(email),
    metadata: { severity },
  });
};

const notifyConfirmation = async ({ userId, email, title, message, reference }) => {
  return createNotification({
    userId,
    type: NOTIFICATION_TYPES.CONFIRMATION,
    title: title || 'Confirmación',
    message: message || 'Operación confirmada',
    email,
    emailSubject: title || 'Confirmación Banco La 33',
    sendMail: Boolean(email),
    metadata: { reference },
  });
};

const sendCustomEmail = async ({ userId, email, subject, message }) => {
  return createNotification({
    userId,
    type: NOTIFICATION_TYPES.EMAIL,
    title: subject || 'Mensaje del banco',
    message,
    email,
    emailSubject: subject,
    sendMail: true,
    metadata: { channel: 'email' },
  });
};

const listByUser = async (userId, { page = 1, limit = 20, unreadOnly = false } = {}) => {
  const filter = { userId: String(userId) };
  if (unreadOnly) filter.read = false;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const [items, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Notification.countDocuments(filter),
  ]);

  return {
    notifications: items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  };
};

const getByIdForUser = async (id, userId) => {
  const item = await Notification.findOne({ _id: id, userId: String(userId) });
  if (!item) throw new NotificationError('Notificación no encontrada', 404);
  return item;
};

const markAsRead = async (id, userId) => {
  const item = await Notification.findOneAndUpdate(
    { _id: id, userId: String(userId) },
    { read: true },
    { new: true }
  );
  if (!item) throw new NotificationError('Notificación no encontrada', 404);
  return item;
};

const countUnread = async (userId) => {
  const count = await Notification.countDocuments({ userId: String(userId), read: false });
  return count;
};

module.exports = {
  createNotification,
  notifyTransfer,
  notifyDeposit,
  notifyPasswordChanged,
  notifyPasswordResetRequested,
  notifyAlert,
  notifyConfirmation,
  sendCustomEmail,
  listByUser,
  getByIdForUser,
  markAsRead,
  countUnread,
};
