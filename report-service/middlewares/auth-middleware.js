const { verify } = require("../helpers/jwt-helpers");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN_ROLE") {
    return res.status(403).json({ message: "Acceso solo ADMIN" });
  }
  next();
};