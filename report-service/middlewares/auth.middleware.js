const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token =
    req.header('x-token') ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : req.headers.authorization?.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token requerido' });
  }

  try {
    const options = {};
    if (process.env.JWT_ISSUER) options.issuer = process.env.JWT_ISSUER;
    if (process.env.JWT_AUDIENCE) options.audience = process.env.JWT_AUDIENCE;
    req.user = jwt.verify(token, process.env.JWT_SECRET, options);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }
};

const resolveRole = (role) => {
  if (role == null) return '';
  if (Array.isArray(role)) return String(role[0] || '').trim().toUpperCase();
  return String(role).trim().toUpperCase();
};

const isAdmin = (req, res, next) => {
  const role = resolveRole(req.user?.role);
  if (role !== 'ADMIN_ROLE' && role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Acceso solo ADMIN' });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
