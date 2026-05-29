const BASE = process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3001/BancoLa33/v1';

const fetchJson = async (path) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${BASE}${path}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

const validateAccountType = async (accountTypeId) => {
  if (!accountTypeId) return { valid: true };

  const payload = await fetchJson(`/accountTypes/${accountTypeId}`);
  if (!payload?.success || !payload?.data) {
    return { valid: false, message: 'Tipo de cuenta no encontrado en Products Service' };
  }

  if (payload.data.isActive === false) {
    return { valid: false, message: 'El tipo de cuenta está inactivo' };
  }

  return { valid: true, accountType: payload.data };
};

const getAccountTypesMap = async () => {
  const payload = await fetchJson('/accountTypes?limit=100');
  const list = payload?.data || payload?.accountTypes || [];

  const map = {};
  for (const type of list) {
    if (type?._id) {
      map[String(type._id)] = type.name;
    }
  }
  return map;
};

module.exports = { validateAccountType, getAccountTypesMap };
