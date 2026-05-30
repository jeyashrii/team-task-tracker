const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const AppError = require("../utils/AppError");
const User = require("../models/userModel");

const authenticateUser = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(401, "UNAUTHORIZED", "Access token missing");
  }

  const token = authHeader.split(" ")[1];

  const tokenPayload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  const user = await User.findById(tokenPayload.userId).select("-password");
  if (!user) {
    throw new AppError(401, "UNAUTHORIZED", "User not found");
  }
  req.user = user;
  next();
});

module.exports = { authenticateUser };
