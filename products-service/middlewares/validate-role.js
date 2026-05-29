'use strict';

const ROLE_MAP = {
  ADMIN: 'ADMIN',
  ADMIN_ROLE: 'ADMIN',
  CLIENT: 'CLIENT',
  USER_ROLE: 'CLIENT',
};

export const requireRole = (...allowedRoles) => {
  const normalizedAllowed = allowedRoles.map((r) => ROLE_MAP[r] || r);

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        error: 'UNAUTHORIZED',
      });
    }

    const raw = Array.isArray(req.user.role) ? req.user.role[0] : req.user.role;
    const userRole = ROLE_MAP[String(raw || '').toUpperCase()] || String(raw || '').toUpperCase();

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso',
        error: 'FORBIDDEN',
        requiredRole: allowedRoles,
        yourRole: userRole,
      });
    }

    next();
  };
};
