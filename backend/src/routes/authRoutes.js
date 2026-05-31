const express = require("express");

const {
  registerUser,
  loginUser,
  rotateRefreshToken,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", rotateRefreshToken);

module.exports = router;
