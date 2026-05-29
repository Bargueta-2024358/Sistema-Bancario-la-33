module.exports = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  console.error(`[reports] ${req.method} ${req.path}:`, err.message);

  if (err.name === 'ReportError' || err.statusCode) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
      error: err.code || 'REPORT_ERROR',
    });
  }

  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { details: err.message }),
  });
};
