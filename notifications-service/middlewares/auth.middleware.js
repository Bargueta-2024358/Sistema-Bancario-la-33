const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token =
    req.header('x-token') ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : req.headers.authorization?.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token requerido', error: 'MISSING_TOKEN' });
  }

  try {
    const options = {};
    if (process.env.JWT_ISSUER) options.issuer = process.env.JWT_ISSUER;
    if (process.env.JWT_AUDIENCE) options.audience = process.env.JWT_AUDIENCE;

    const decoded = jwt.verify(token, process.env.JWT_SECRET, options);
    const roleRaw = decoded.role;
    const role = Array.isArray(roleRaw)
      ? String(roleRaw[0] || '')
      : String(roleRaw || '');

    req.user = {
      id: decoded.sub || decoded.id || decoded.userId,
      role,
    };
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token inválido', error: 'INVALID_TOKEN' });
  }
};
