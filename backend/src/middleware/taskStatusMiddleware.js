const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");
const AppError = require("../utils/AppError");
const canChangeTaskStatus = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    throw new AppError(404, "TASK_NOT_FOUND", "Task not found");
  }
  const isManager = req.user.role === "MANAGER";
  const isAdmin = req.user.role === "ADMIN";

  const isAssignee =
    task.assignee && task.assignee.toString() == req.user._id.toString();
  if (!isManager && !isAdmin && !isAssignee) {
    throw new AppError(
      403,
      "FORBIDDEN",
      "You dont have access to update task status",
    );
  }
  req.task = task;
  next();
});

module.exports = canChangeTaskStatus;
