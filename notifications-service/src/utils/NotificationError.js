class NotificationError extends Error {
  constructor(message, statusCode = 400, code = 'NOTIFICATION_ERROR') {
    super(message);
    this.name = 'NotificationError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

module.exports = NotificationError;
