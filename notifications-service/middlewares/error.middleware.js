const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  console.error(`[notifications] ${req.method} ${req.path}: ${err.message}`);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: 'Error de validación' });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'ID inválido', error: 'INVALID_ID' });
  }

  if (err.name === 'NotificationError' || err.statusCode) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
      error: err.code || 'NOTIFICATION_ERROR',
    });
  }

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: 'INTERNAL_SERVER_ERROR',
  });
};

module.exports = errorHandler;
