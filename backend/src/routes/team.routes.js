const express = require("express");
const { getTeamHandler, updateUserRoleHandler } = require("../controllers/team.controller");
const { protect } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const { body, param } = require("express-validator");
const validate = require("../middlewares/validate.middleware");
const ROLES = require("../constants/roles");

const router = express.Router();

// All team routes require authentication
router.use(protect);

// GET /api/team — get all team members
router.get("/", getTeamHandler);

// PATCH /api/team/:userId/role — update user role (admin only)
router.patch(
  "/:userId/role",
  requireRole(ROLES.ADMIN),
  [
    param("userId").isMongoId().withMessage("Invalid user ID"),
    body("role")
      .notEmpty().withMessage("Role is required")
      .isIn([ROLES.ADMIN, ROLES.MEMBER]).withMessage("Role must be ADMIN or MEMBER"),
  ],
  validate,
  updateUserRoleHandler
);

module.exports = router;
