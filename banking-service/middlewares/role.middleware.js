const { normalizeRole } = require('../helpers/resolveRole');

module.exports = (...allowedRoles) => {
  const normalizedAllowed = allowedRoles.map((r) => normalizeRole(r));

  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(403).json({ success: false, message: 'No tienes permisos para esta acción' });
    }

    const userRole = normalizeRole(req.user.role);

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({ success: false, message: 'No tienes permisos para esta acción' });
    }

    next();
  };
};
