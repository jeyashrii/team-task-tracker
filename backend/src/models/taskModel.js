const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
    },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"],
      default: "TODO",
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);
taskSchema.index({ status: 1 });
taskSchema.index({ assignee: 1 });
taskSchema.index({ dueDate: 1 });
module.exports = mongoose.model("Task", taskSchema);
