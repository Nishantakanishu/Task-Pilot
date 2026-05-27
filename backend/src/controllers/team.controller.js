const asyncHandler = require("../utils/asyncHandler");
const { getTeam, updateUserRole } = require("../services/team.service");

/**
 * GET /api/team
 * Returns team members visible to the requesting user.
 */
const getTeamHandler = asyncHandler(async (req, res) => {
  const team = await getTeam(req.user);

  res.status(200).json({
    success: true,
    message: "Team fetched successfully",
    data: team,
  });
});

/**
 * PATCH /api/team/:userId/role
 * Admin-only: update a user's system role (ADMIN | MEMBER).
 */
const updateUserRoleHandler = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await updateUserRole(req.params.userId, role, req.user);

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    data: user,
  });
});

module.exports = { getTeamHandler, updateUserRoleHandler };
