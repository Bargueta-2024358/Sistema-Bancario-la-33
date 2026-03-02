module.exports = (...allowedRoles) => {
    return (req, res, next) => {

        if (!req.user || !req.user.role) {
            return res.status(403).json({
                message: "No tienes permisos para esta acción"
            });
        }

        const userRole = req.user.role.toUpperCase();
        const normalizedRoles = allowedRoles.map(r => r.toUpperCase());

        if (!normalizedRoles.includes(userRole)) {
            return res.status(403).json({
                message: "No tienes permisos para esta acción"
            });
        }

        next();
    };
};