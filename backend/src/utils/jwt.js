const jwt = require("jsonwebtoken");

const createAccessToken = (userId, role) => {
  return jwt.sign(
    {
      userId,
      role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

const createRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = { createAccessToken, createRefreshToken };
