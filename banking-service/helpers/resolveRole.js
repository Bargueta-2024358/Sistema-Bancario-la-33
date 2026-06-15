const ROLE_MAP = {
  ADMIN: 'ADMIN',
  ADMIN_ROLE: 'ADMIN',
  CLIENT: 'CLIENT',
  USER_ROLE: 'CLIENT',
};


const resolveRole = (role) => {
  if (role == null) return '';
  if (Array.isArray(role)) {
    const first = role.find((r) => r != null && String(r).trim());
    return first != null ? String(first).trim() : '';
  }
  return String(role).trim();
};

const normalizeRole = (role) => {
  const raw = resolveRole(role).toUpperCase();
  return ROLE_MAP[raw] || raw;
};

module.exports = { resolveRole, normalizeRole, ROLE_MAP };
