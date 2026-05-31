const AppError = require("../utils/AppError");

const checkRoleAccess = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError(401, "UNAUTHORIZED", "User not authenticated");
    }
    const hasAccess = allowedRoles.includes(req.user.role);

    if (!hasAccess) {
      throw new AppError(
        403,
        "FORBIDDEN",
        "you do not have access to perfom this action",
      );
    }

    next();
  };
};

module.exports = checkRoleAccess;
