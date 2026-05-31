const express = require("express");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const app = express();
const errorMiddleware = require("./middleware/errorMiddleware");
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "app created ",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use(errorMiddleware);
module.exports = app;
