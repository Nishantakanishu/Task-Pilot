const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/projects", require("./routes/project.routes"));
app.use("/api/tasks", require("./routes/task.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/teams", require("./routes/teams.routes"));
app.use("/api/team", require("./routes/team.routes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use(errorMiddleware);

module.exports = app;
