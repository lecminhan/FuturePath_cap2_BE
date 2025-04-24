const authorize = (roles = []) => {
  return (req, res, next) => {
    if (roles.length === 0) return next();

    if (!req.user?.role) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const hasPermission = roles.includes(req.user.role.id);
    if (!hasPermission) {
      return res.status(403).json({
        error: `Required roles: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = authorize;
