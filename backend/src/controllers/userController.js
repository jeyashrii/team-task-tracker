const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    throw new AppError(400, "VALIDATION_ERROR", "All fields are required");
  }

  const userExists = await User.exists({
    email: email.toLowerCase(),
  });

  if (userExists) {
    throw new AppError(400, "USER_EXISTS", "User already exists");
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password,
    role,
    organization: req.user.organization,
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
});
module.exports = { createUser };
