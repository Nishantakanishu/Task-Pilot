const Team = require("../models/Team.model");
const Project = require("../models/Project.model");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const ROLES = require("../constants/roles");

// Helper — verify project exists and user has access
const verifyProjectAccess = async (projectId, user) => {
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  if (
    user.role !== ROLES.ADMIN &&
    !project.members.some((m) => m.toString() === user._id.toString())
  ) {
    throw new ApiError(403, "Access denied. You are not a member of this project.");
  }

  return project;
};

// Create team (admin only)
const createTeam = async ({ name, description, projectId, userId }) => {
  await verifyProjectAccess(projectId, { role: ROLES.ADMIN, _id: userId });

  const team = await Team.create({
    name,
    description,
    project: projectId,
    createdBy: userId,
  });

  return team.populate([
    { path: "createdBy", select: "name email" },
    { path: "project", select: "title" },
  ]);
};

// Get all teams for a project
const getProjectTeams = async (projectId, user) => {
  await verifyProjectAccess(projectId, user);

  return Team.find({ project: projectId })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};

// Get all teams across all projects for a user
const getAllUserTeams = async (user) => {
  if (user.role === ROLES.ADMIN) {
    return Team.find()
      .populate("project", "title description")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
  }

  // Find all projects the user has access to
  const projects = await Project.find({ members: user._id });
  const projectIds = projects.map((p) => p._id);

  return Team.find({
    $or: [
      { project: { $in: projectIds } },
      { "members.user": user._id }
    ]
  })
    .populate("project", "title description")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};

// Get a single team
const getTeamById = async (projectId, teamId, user) => {
  await verifyProjectAccess(projectId, user);

  const team = await Team.findOne({ _id: teamId, project: projectId })
    .populate("createdBy", "name email")
    .populate("project", "title");

  if (!team) throw new ApiError(404, "Team not found");
  return team;
};

// Update team (admin only)
const updateTeam = async (projectId, teamId, { name, description }) => {
  const team = await Team.findOneAndUpdate(
    { _id: teamId, project: projectId },
    { ...(name && { name }), ...(description !== undefined && { description }) },
    { new: true, runValidators: true }
  )
    .populate("createdBy", "name email")
    .populate("project", "title");

  if (!team) throw new ApiError(404, "Team not found");
  return team;
};

// Delete team (admin only)
const deleteTeam = async (projectId, teamId) => {
  const team = await Team.findOneAndDelete({ _id: teamId, project: projectId });
  if (!team) throw new ApiError(404, "Team not found");
  return team;
};

// ── Members Management ────────────────────────────────────────────────────────

// Add member to team (admin only)
const addMemberToTeam = async (projectId, teamId, { userId, role }, requestingUser) => {
  // 1. Verify project admin
  const project = await verifyProjectAccess(projectId, { role: ROLES.ADMIN, _id: requestingUser._id });

  // 2. Validate user exists and sync with project workspace
  const userToAdd = await User.findById(userId);
  if (!userToAdd) throw new ApiError(404, "User not found");
  
  if (!project.members.some((m) => m.toString() === userId.toString())) {
    project.members.push(userId);
    await project.save();
  }

  // 3. Strict Rule: User can belong to ONLY ONE team inside the same project
  const existingTeamWithUser = await Team.findOne({
    project: projectId,
    "members.user": userId
  });

  if (existingTeamWithUser) {
    throw new ApiError(400, `User is already a member of team: ${existingTeamWithUser.name}`);
  }

  // 4. Add to this team
  const team = await Team.findOne({ _id: teamId, project: projectId });
  if (!team) throw new ApiError(404, "Team not found");

  team.members.push({ user: userId, role: role || "MEMBER" });
  await team.save();

  return team;
};

// Remove member from team (admin only)
const removeMemberFromTeam = async (projectId, teamId, userId, requestingUser) => {
  await verifyProjectAccess(projectId, { role: ROLES.ADMIN, _id: requestingUser._id });

  const team = await Team.findOne({ _id: teamId, project: projectId });
  if (!team) throw new ApiError(404, "Team not found");

  const memberIndex = team.members.findIndex((m) => m.user.toString() === userId.toString());
  if (memberIndex === -1) throw new ApiError(404, "User is not a member of this team");

  team.members.splice(memberIndex, 1);
  await team.save();

  // Sync with project: if user is not in ANY team in the project, remove from project.members
  const existingTeamWithUser = await Team.findOne({
    project: projectId,
    "members.user": userId
  });

  if (!existingTeamWithUser) {
    const project = await Project.findById(projectId);
    if (project) {
      project.members = project.members.filter((m) => m.toString() !== userId.toString());
      await project.save();
    }
  }

  return team;
};

// Update member role (admin only)
const updateMemberRole = async (projectId, teamId, userId, role, requestingUser) => {
  await verifyProjectAccess(projectId, { role: ROLES.ADMIN, _id: requestingUser._id });

  const team = await Team.findOne({ _id: teamId, project: projectId });
  if (!team) throw new ApiError(404, "Team not found");

  const member = team.members.find((m) => m.user.toString() === userId.toString());
  if (!member) throw new ApiError(404, "User is not a member of this team");

  member.role = role;
  await team.save();

  return team;
};

// Get team members
const getTeamMembers = async (projectId, teamId, user) => {
  await verifyProjectAccess(projectId, user);

  const team = await Team.findOne({ _id: teamId, project: projectId }).populate(
    "members.user",
    "name email role createdAt"
  );

  if (!team) throw new ApiError(404, "Team not found");

  // Format the output to flatten the user details for easier frontend consumption
  return team.members.map(m => ({
    _id: m.user._id,
    name: m.user.name,
    email: m.user.email,
    systemRole: m.user.role,
    role: m.role, // Team role
    joinedAt: m.joinedAt
  }));
};

module.exports = {
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
};
