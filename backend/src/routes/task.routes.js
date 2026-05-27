const express = require("express");
const {
  createTaskHandler,
  getTasksHandler,
  getTaskByIdHandler,
  updateTaskHandler,
  deleteTaskHandler,
} = require("../controllers/task.controller");
const {
  createTaskValidator,
  updateTaskValidator,
  updateStatusValidator,
} = require("../validators/task.validator");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const ROLES = require("../constants/roles");

const router = express.Router();

// All task routes require authentication
router.use(protect);

// GET /api/tasks — list all accessible tasks
router.get("/", getTasksHandler);

// POST /api/tasks — create task (admin only)
router.post(
  "/",
  requireRole(ROLES.ADMIN),
  createTaskValidator,
  validate,
  createTaskHandler
);

// GET /api/tasks/:id — get single task
router.get("/:id", getTaskByIdHandler);

// PATCH /api/tasks/:id — update task
// Note: Validator will depend on the role. We can just use updateTaskValidator, 
// and the service will ensure members can only update status.
// But to be cleaner, we can dynamically validate or just let the service handle the strict logic.
// We'll use the updateTaskValidator since it makes all fields optional.
router.patch(
  "/:id",
  updateTaskValidator,
  validate,
  updateTaskHandler
);

// DELETE /api/tasks/:id — delete task (admin only)
router.delete(
  "/:id",
  requireRole(ROLES.ADMIN),
  deleteTaskHandler
);

module.exports = router;
