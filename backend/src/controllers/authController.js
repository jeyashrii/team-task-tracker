const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Organization = require("../models/organizationModel");

const AppError = require("../utils/AppError");

const { createAccessToken, createRefreshToken } = require("../utils/jwt");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, organization } = req.body;

  if (
    !name?.trim() ||
    !email?.trim() ||
    !password?.trim() ||
    !organization?.trim()
  ) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "Please enter all required fields",
    );
  }

  const userExists = await User.exists({ email: email.toLowerCase() });
  if (userExists) {
    throw new AppError(409, "Existing_User", "User already exists");
  }

  const org = new Organization({
    name: organization.trim(),
  });

  await org.save();

  const user = new User({
    name: name.trim(),
    email: email.toLowerCase(),
    password,
    role: "ADMIN",
    organization: org._id,
  });

  await user.save();

  const accessToken = createAccessToken(user._id, user.role);

  const refreshToken = createRefreshToken(user._id);

  return res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "Email and password are required",
    );
  }
  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }
  const accessToken = createAccessToken(user._id, user.role);
  const refreshToken = createRefreshToken(user._id);

  return res.status(200).json({
    success: true,
    message: "login successful",
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});
module.exports = {
  registerUser,
  loginUser,
};
