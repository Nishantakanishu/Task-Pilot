const express = require("express");
const {
  createProjectHandler,
  getProjectsHandler,
  getProjectByIdHandler,
  updateProjectHandler,
  addMemberHandler,
  removeMemberHandler,
  getAllUsersHandler,
} = require("../controllers/project.controller");
const {
  createTeamHandler,
  getProjectTeamsHandler,
  getTeamByIdHandler,
  updateTeamHandler,
  deleteTeamHandler,
  addMemberToTeamHandler,
  removeMemberFromTeamHandler,
  updateMemberRoleHandler,
  getTeamMembersHandler,
} = require("../controllers/projectTeam.controller");
const {
  createProjectValidator,
  updateProjectValidator,
  memberValidator,
} = require("../validators/project.validator");
const {
  createTeamValidator,
  updateTeamValidator,
  addTeamMemberValidator,
  updateTeamMemberRoleValidator,
} = require("../validators/teamCrud.validator");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const ROLES = require("../constants/roles");

const router = express.Router();

// All project routes require authentication
router.use(protect);

// GET /api/projects — list all (admin) or assigned (member)
router.get("/", getProjectsHandler);

// GET /api/projects/users — all users list for member picker
router.get("/users", getAllUsersHandler);

// POST /api/projects — create project (admin only)
router.post(
  "/",
  requireRole(ROLES.ADMIN),
  createProjectValidator,
  validate,
  createProjectHandler
);

// GET /api/projects/:id — project detail
router.get("/:id", getProjectByIdHandler);

// PATCH /api/projects/:id — update project (admin only)
router.patch(
  "/:id",
  requireRole(ROLES.ADMIN),
  updateProjectValidator,
  validate,
  updateProjectHandler
);

// [DEPRECATED] POST /api/projects/:id/members — add member (admin only)
// Direct project member assignment is deprecated in favor of Team assignment
router.post(
  "/:id/members",
  requireRole(ROLES.ADMIN),
  memberValidator,
  validate,
  addMemberHandler
);

// [DEPRECATED] DELETE /api/projects/:id/members/:userId — remove member (admin only)
// Direct project member removal is deprecated in favor of Team assignment
router.delete(
  "/:id/members/:userId",
  requireRole(ROLES.ADMIN),
  removeMemberHandler
);

// ── Project Teams (Project → Teams hierarchy) ─────────────────────────────────

// GET /api/projects/:id/teams — list teams for a project
router.get("/:id/teams", getProjectTeamsHandler);

// POST /api/projects/:id/teams — create team (admin only)
router.post(
  "/:id/teams",
  requireRole(ROLES.ADMIN),
  createTeamValidator,
  validate,
  createTeamHandler
);

// GET /api/projects/:id/teams/:teamId — get single team
router.get("/:id/teams/:teamId", getTeamByIdHandler);

// PATCH /api/projects/:id/teams/:teamId — update team (admin only)
router.patch(
  "/:id/teams/:teamId",
  requireRole(ROLES.ADMIN),
  updateTeamValidator,
  validate,
  updateTeamHandler
);

// DELETE /api/projects/:id/teams/:teamId — delete team (admin only)
router.delete(
  "/:id/teams/:teamId",
  requireRole(ROLES.ADMIN),
  deleteTeamHandler
);

// ── Team Members (Teams → Members hierarchy) ──────────────────────────────────

// GET /api/projects/:id/teams/:teamId/members — get team members
router.get("/:id/teams/:teamId/members", getTeamMembersHandler);

// POST /api/projects/:id/teams/:teamId/members — add member (admin only)
router.post(
  "/:id/teams/:teamId/members",
  requireRole(ROLES.ADMIN),
  addTeamMemberValidator,
  validate,
  addMemberToTeamHandler
);

// DELETE /api/projects/:id/teams/:teamId/members/:userId — remove member (admin only)
router.delete(
  "/:id/teams/:teamId/members/:userId",
  requireRole(ROLES.ADMIN),
  removeMemberFromTeamHandler
);

// PATCH /api/projects/:id/teams/:teamId/members/:userId/role — update role (admin only)
router.patch(
  "/:id/teams/:teamId/members/:userId/role",
  requireRole(ROLES.ADMIN),
  updateTeamMemberRoleValidator,
  validate,
  updateMemberRoleHandler
);

module.exports = router;

