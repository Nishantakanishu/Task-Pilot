const User = require("../models/User.model");
const Project = require("../models/Project.model");
const ApiError = require("../utils/ApiError");
const ROLES = require("../constants/roles");

/**
 * Get team members.
 * - Admin: all users in the system, enriched with their project count.
 * - Member: all users who share at least one project with the requester.
 */
const getTeam = async (requestingUser) => {
  if (requestingUser.role === ROLES.ADMIN) {
    // Fetch all users
    const users = await User.find({}, "name email role createdAt").sort({ name: 1 });

    // Fetch project-member counts in one query: { userId -> count }
    const projects = await Project.find({}, "members");
    const projectCountByUser = {};
    for (const project of projects) {
      for (const memberId of project.members) {
        const key = memberId.toString();
        projectCountByUser[key] = (projectCountByUser[key] || 0) + 1;
      }
    }

    return users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      projectCount: projectCountByUser[u._id.toString()] || 0,
    }));
  }

  // Member: find all projects this user belongs to
  const memberProjects = await Project.find({ members: requestingUser._id })
    .populate("members", "name email role createdAt");

  // Collect unique teammates (excluding self)
  const teammateMap = new Map();
  for (const project of memberProjects) {
    for (const member of project.members) {
      const id = member._id.toString();
      if (id !== requestingUser._id.toString() && !teammateMap.has(id)) {
        teammateMap.set(id, {
          _id: member._id,
          name: member.name,
          email: member.email,
          role: member.role,
          createdAt: member.createdAt,
          projectCount: null, // not relevant for member view
        });
      }
    }
  }

  return Array.from(teammateMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

/**
 * Update a user's system role (admin only).
 */
const updateUserRole = async (targetUserId, newRole, requestingUser) => {
  if (![ROLES.ADMIN, ROLES.MEMBER].includes(newRole)) {
    throw new ApiError(400, "Invalid role. Must be ADMIN or MEMBER.");
  }

  // Prevent demoting yourself
  if (targetUserId === requestingUser._id.toString()) {
    throw new ApiError(400, "You cannot change your own role.");
  }

  const user = await User.findById(targetUserId);
  if (!user) throw new ApiError(404, "User not found.");

  user.role = newRole;
  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

module.exports = { getTeam, updateUserRole };
