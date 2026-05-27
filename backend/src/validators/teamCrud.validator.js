const { body } = require("express-validator");

const createTeamValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Team name is required")
    .isLength({ min: 2, max: 80 })
    .withMessage("Team name must be between 2 and 80 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 400 })
    .withMessage("Description cannot exceed 400 characters"),
];

const updateTeamValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Team name must be between 2 and 80 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 400 })
    .withMessage("Description cannot exceed 400 characters"),
];

const addTeamMemberValidator = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  body("role")
    .optional()
    .isIn(["ADMIN", "MEMBER"])
    .withMessage("Role must be ADMIN or MEMBER"),
];

const updateTeamMemberRoleValidator = [
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["ADMIN", "MEMBER"])
    .withMessage("Role must be ADMIN or MEMBER"),
];

module.exports = {
  createTeamValidator,
  updateTeamValidator,
  addTeamMemberValidator,
  updateTeamMemberRoleValidator,
};
