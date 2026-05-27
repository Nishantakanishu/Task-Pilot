const asyncHandler = require("../utils/asyncHandler");
const {
  createTeam,
  getProjectTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  addMemberToTeam,
  removeMemberFromTeam,
  updateMemberRole,
  getTeamMembers,
  getAllUserTeams,
} = require("../services/projectTeam.service");

// POST /api/projects/:id/teams
const createTeamHandler = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const team = await createTeam({
    name,
    description,
    projectId: req.params.id,
    userId: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Team created successfully",
    data: team,
  });
});

// GET /api/projects/:id/teams
const getProjectTeamsHandler = asyncHandler(async (req, res) => {
  const teams = await getProjectTeams(req.params.id, req.user);

  res.status(200).json({
    success: true,
    message: "Teams fetched successfully",
    data: teams,
  });
});

// GET /api/teams (Global teams across all projects)
const getAllUserTeamsHandler = asyncHandler(async (req, res) => {
  const teams = await getAllUserTeams(req.user);

  res.status(200).json({
    success: true,
    message: "All teams fetched successfully",
    data: teams,
  });
});

// GET /api/projects/:id/teams/:teamId
const getTeamByIdHandler = asyncHandler(async (req, res) => {
  const team = await getTeamById(req.params.id, req.params.teamId, req.user);

  res.status(200).json({
    success: true,
    message: "Team fetched successfully",
    data: team,
  });
});

// PATCH /api/projects/:id/teams/:teamId
const updateTeamHandler = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const team = await updateTeam(req.params.id, req.params.teamId, { name, description });

  res.status(200).json({
    success: true,
    message: "Team updated successfully",
    data: team,
  });
});

// DELETE /api/projects/:id/teams/:teamId
const deleteTeamHandler = asyncHandler(async (req, res) => {
  await deleteTeam(req.params.id, req.params.teamId);

  res.status(200).json({
    success: true,
    message: "Team deleted successfully",
  });
});

// ── Members Management Handlers ──────────────────────────────────────────────────

// POST /api/projects/:id/teams/:teamId/members
const addMemberToTeamHandler = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;
  const team = await addMemberToTeam(req.params.id, req.params.teamId, { userId, role }, req.user);

  res.status(200).json({
    success: true,
    message: "Member added successfully",
    data: team,
  });
});

// DELETE /api/projects/:id/teams/:teamId/members/:userId
const removeMemberFromTeamHandler = asyncHandler(async (req, res) => {
  const team = await removeMemberFromTeam(req.params.id, req.params.teamId, req.params.userId, req.user);

  res.status(200).json({
    success: true,
    message: "Member removed successfully",
    data: team,
  });
});

// PATCH /api/projects/:id/teams/:teamId/members/:userId/role
const updateMemberRoleHandler = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const team = await updateMemberRole(req.params.id, req.params.teamId, req.params.userId, role, req.user);

  res.status(200).json({
    success: true,
    message: "Member role updated successfully",
    data: team,
  });
});

// GET /api/projects/:id/teams/:teamId/members
const getTeamMembersHandler = asyncHandler(async (req, res) => {
  const members = await getTeamMembers(req.params.id, req.params.teamId, req.user);

  res.status(200).json({
    success: true,
    message: "Team members fetched successfully",
    data: members,
  });
});

module.exports = {
  createTeamHandler,
  getProjectTeamsHandler,
  getTeamByIdHandler,
  updateTeamHandler,
  deleteTeamHandler,
  addMemberToTeamHandler,
  removeMemberFromTeamHandler,
  updateMemberRoleHandler,
  getTeamMembersHandler,
  getAllUserTeamsHandler,
};
