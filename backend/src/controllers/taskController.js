const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");
const AppError = require("../utils/AppError");

const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, assignee, dueDate } = req.body;
  if (!title.trim()) {
    throw new AppError(400, "VALIDATION_ERROR", "Title is required");
  }

  const task = await Task.create({
    title: title.trim(),
    description,
    priority,
    assignee,
    dueDate,
  });

  return res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task,
  });
});

const getTasks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, priority, assignee } = req.query;
  const filters = {};
  if (status) {
    filters.status = status;
  }
  if (priority) {
    filters.priority = priority;
  }
  if (assignee) {
    filters.assignee = assignee;
  }

  const tasks = await Task.find(filters)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate("assignee", "name email role");

  const totalTasks = await Task.countDocuments(filters);

  return res.status(200).json({
    sucess: true,
    totalTasks,
    currentPage: Number(page),
    totalPages: Math.ceil(totalTasks / limit),
    data: tasks,
  });
});

const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);
  if (!task) {
    throw new AppError(404, "TASK_NOT_FOUND", "Task not found");
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    throw new AppError(404, "TASK_NOT_FOUND", "Task not found");
  }
  Object.assign(task, req.body);
  await task.save();
  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: task,
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    throw new AppError(404, "TASK_NOT_FOUND", "Task not found");
  }
  await task.deleteOne();
  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});

const changeTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const task = req.task;
  const statusProgress = {
    TODO: ["IN_PROGRESS", "BLOCKED"],
    IN_PROGRESS: ["IN_REVIEW", "BLOCKED"],
    IN_REVIEW: ["DONE", "BLOCKED"],
    DONE: [],
    BLOCKED: [],
  };
  const allowedStatuses = statusProgress[task.status];

  if (!allowedStatuses.includes(status)) {
    throw new AppError(
      400,
      "INVALID_STATUS_MOVE",
      `Cannot move task from ${task.status} to ${status}`,
    );
  }
  task.status = status;
  await task.save();

  res.status(200).json({
    success: true,
    message: "Updated task status",
    task,
  });
});
module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  changeTaskStatus,
};
