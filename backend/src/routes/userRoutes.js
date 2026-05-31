const express = require("express");

const { createUser } = require("../controllers/userController");
const authenticateUser = require("../middleware/authMiddleware");
const checkRoleAccess = require("../middleware/roleMiddleware");
const router = express.Router();

router.post("/", authenticateUser, checkRoleAccess("ADMIN"), createUser);

module.exports = router;
