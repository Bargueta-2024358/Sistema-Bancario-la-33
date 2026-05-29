module.exports = (req, res, next) => {
  const expected = process.env.INTERNAL_SERVICE_KEY;
  if (!expected) return next();

  const key = req.header('x-service-key');
  if (key !== expected) {
    return res.status(403).json({ success: false, message: 'x-service-key inválida' });
  }
  next();
};
