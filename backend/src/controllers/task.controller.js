const asyncHandler = require("../utils/asyncHandler");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../services/task.service");

const createTaskHandler = asyncHandler(async (req, res) => {
  const task = await createTask(req.body, req.user._id);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task,
  });
});

const getTasksHandler = asyncHandler(async (req, res) => {
  const tasks = await getTasks(req.user, req.query);

  res.status(200).json({
    success: true,
    message: "Tasks fetched successfully",
    data: tasks,
  });
});

const getTaskByIdHandler = asyncHandler(async (req, res) => {
  const task = await getTaskById(req.params.id, req.user);

  res.status(200).json({
    success: true,
    message: "Task fetched successfully",
    data: task,
  });
});

const updateTaskHandler = asyncHandler(async (req, res) => {
  const task = await updateTask(req.params.id, req.body, req.user);

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: task,
  });
});

const deleteTaskHandler = asyncHandler(async (req, res) => {
  const task = await deleteTask(req.params.id);

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    data: task,
  });
});

module.exports = {
  createTaskHandler,
  getTasksHandler,
  getTaskByIdHandler,
  updateTaskHandler,
  deleteTaskHandler,
};
