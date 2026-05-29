const jwt = require('jsonwebtoken');
const { resolveRole } = require('../helpers/resolveRole');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Token requerido' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader.split(' ')[1];

  try {
    const options = {};
    if (process.env.JWT_ISSUER) options.issuer = process.env.JWT_ISSUER;
    if (process.env.JWT_AUDIENCE) options.audience = process.env.JWT_AUDIENCE;

    const decoded = jwt.verify(token, process.env.JWT_SECRET, options);
    req.user = {
      ...decoded,
      sub: decoded.sub,
      id: decoded.sub || decoded.id,
      role: resolveRole(decoded.role),
    };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }
};
