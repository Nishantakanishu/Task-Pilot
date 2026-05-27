const Project = require("../models/Project.model");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const ROLES = require("../constants/roles");

// Create a new project (admin only)
const createProject = async ({ title, description, userId, members = [] }) => {
  // Ensure the creator is always included and there are no duplicates
  const projectMembers = [...new Set([userId.toString(), ...members.map(m => m.toString())])];

  const project = await Project.create({
    title,
    description,
    createdBy: userId,
    members: projectMembers,
  });

  return project.populate([
    { path: "createdBy", select: "name email role" },
    { path: "members", select: "name email role" },
  ]);
};

// Get all projects — admin sees all, member sees only theirs
const getProjects = async (user) => {
  let query;

  if (user.role === ROLES.ADMIN) {
    query = Project.find();
  } else {
    query = Project.find({ members: user._id });
  }

  return query
    .populate("createdBy", "name email role")
    .populate("members", "name email role")
    .sort({ createdAt: -1 });
};

// Get a single project by ID
const getProjectById = async (projectId, user) => {
  const project = await Project.findById(projectId)
    .populate("createdBy", "name email role")
    .populate("members", "name email role");

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Members can only view their own projects
  if (
    user.role !== ROLES.ADMIN &&
    !project.members.some((m) => m._id.toString() === user._id.toString())
  ) {
    throw new ApiError(403, "Access denied. You are not a member of this project.");
  }

  return project;
};

// Update project (admin only)
const updateProject = async (projectId, { title, description }) => {
  const project = await Project.findByIdAndUpdate(
    projectId,
    { title, description },
    { new: true, runValidators: true }
  )
    .populate("createdBy", "name email role")
    .populate("members", "name email role");

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

// Add member to project (admin only)
const addMember = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  // Verify user exists
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  // Prevent duplicate members
  if (project.members.some((m) => m.toString() === userId)) {
    throw new ApiError(409, "User is already a member of this project");
  }

  project.members.push(userId);
  await project.save();

  return project.populate([
    { path: "createdBy", select: "name email role" },
    { path: "members", select: "name email role" },
  ]);
};

// Remove member from project (admin only)
const removeMember = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  // Prevent removing the creator
  if (project.createdBy.toString() === userId) {
    throw new ApiError(400, "Cannot remove the project creator");
  }

  project.members = project.members.filter((m) => m.toString() !== userId);
  await project.save();

  return project.populate([
    { path: "createdBy", select: "name email role" },
    { path: "members", select: "name email role" },
  ]);
};

// Get all users (for member selection dropdown)
const getAllUsers = async () => {
  return User.find({}, "name email role").sort({ name: 1 });
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  addMember,
  removeMember,
  getAllUsers,
};
