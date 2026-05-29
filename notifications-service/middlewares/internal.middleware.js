module.exports = (req, res, next) => {
  const key = req.header('x-service-key');
  const expected = process.env.INTERNAL_SERVICE_KEY;

  if (!expected) {
    return res.status(500).json({
      success: false,
      message: 'INTERNAL_SERVICE_KEY no configurada',
    });
  }

  if (!key || key !== expected) {
    return res.status(403).json({
      success: false,
      message: 'Acceso interno no autorizado',
      error: 'FORBIDDEN',
    });
  }

  next();
};
