export function requireRole(allowedRoles = []) {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }

        next();
    };
}
