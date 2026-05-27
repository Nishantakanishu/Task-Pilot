const { body } = require("express-validator");
const { STATUS, PRIORITY } = require("../models/Task.model");

const createTaskValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
  body("project")
    .notEmpty()
    .withMessage("Project is required")
    .isMongoId()
    .withMessage("Invalid project ID"),
  body("team")
    .notEmpty()
    .withMessage("Team is required")
    .isMongoId()
    .withMessage("Invalid team ID"),
  body("assignedTo")
    .optional()
    .isMongoId()
    .withMessage("Invalid assignee ID"),
  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("priority")
    .optional()
    .isIn(Object.values(PRIORITY))
    .withMessage("Invalid priority"),
];

const updateTaskValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),
  body("status")
    .optional()
    .isIn(Object.values(STATUS))
    .withMessage("Invalid status"),
  body("priority")
    .optional()
    .isIn(Object.values(PRIORITY))
    .withMessage("Invalid priority"),
  body("team")
    .optional()
    .isMongoId()
    .withMessage("Invalid team ID"),
  body("assignedTo")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("Invalid assignee ID"),
];

const updateStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(Object.values(STATUS))
    .withMessage("Invalid status"),
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  updateStatusValidator,
};
