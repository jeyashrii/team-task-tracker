const express = require("express");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  changeTaskStatus,
} = require("../controllers/taskController");

const authenticateUser = require("../middleware/authMiddleware");
const checkRoleAccess = require("../middleware/roleMiddleware");
const canChangeTaskStatus = require("../middleware/taskStatusMiddleware");
const router = express.Router();
router.post("/", authenticateUser, createTask);
router.get("/", authenticateUser, getTasks);
router.get("/:id", authenticateUser, getTaskById);
router.put("/:id", authenticateUser, updateTask);

router.delete("/:id", authenticateUser, checkRoleAccess("ADMIN"), deleteTask);
router.patch(
  "/:id/status",
  authenticateUser,
  canChangeTaskStatus,
  changeTaskStatus,
);

module.exports = router;
