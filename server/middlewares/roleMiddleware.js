//Role base access control
const authorizedRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Unauthorized! Access Denied ` });
    }
    next();
  };
};
module.exports = authorizedRoles;
