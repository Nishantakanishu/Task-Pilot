const { Task } = require("../models/Task.model");
const Project = require("../models/Project.model");
const User = require("../models/User.model");
const Team = require("../models/Team.model");
const ApiError = require("../utils/ApiError");
const ROLES = require("../constants/roles");

const createTask = async (taskData, adminId) => {
  const { project: projectId, team: teamId, assignedTo: userId } = taskData;

  // Validate project exists
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  // Validate team exists and belongs to the project
  const team = await Team.findById(teamId);
  if (!team) throw new ApiError(404, "Team not found");
  if (team.project.toString() !== projectId.toString()) {
    throw new ApiError(400, "Team does not belong to this project");
  }

  // If assignee provided, validate user exists and is part of the team
  if (userId) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "Assignee not found");

    const isTeamMember = team.members.some((m) => m.user.toString() === userId.toString());
    if (!isTeamMember) throw new ApiError(400, "Assignee must be a member of the selected team");
  }

  const task = await Task.create({
    ...taskData,
    createdBy: adminId,
  });

  return task.populate([
    { path: "project", select: "title" },
    { path: "team", select: "name" },
    { path: "assignedTo", select: "name email role" },
    { path: "createdBy", select: "name email role" },
  ]);
};

const getTasks = async (user, queryParams = {}) => {
  const query = {};

  // Filtering
  if (queryParams.project) query.project = queryParams.project;
  if (queryParams.team) query.team = queryParams.team;
  if (queryParams.status) query.status = queryParams.status;
  if (queryParams.assignedTo) query.assignedTo = queryParams.assignedTo;

  // Access Control
  if (user.role !== ROLES.ADMIN) {
    // Member can see tasks assigned to them OR tasks in their teams
    const userTeams = await Team.find({ "members.user": user._id }).select("_id");
    const teamIds = userTeams.map((t) => t._id);
    
    query.$or = [
      { assignedTo: user._id },
      { team: { $in: teamIds } }
    ];
  }

  return Task.find(query)
    .populate("project", "title")
    .populate("team", "name")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role")
    .sort({ dueDate: 1, createdAt: -1 });
};

const getTaskById = async (taskId, user) => {
  const task = await Task.findById(taskId)
    .populate("project", "title")
    .populate("team", "name")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role");

  if (!task) throw new ApiError(404, "Task not found");

  // Members can view if assigned OR if they are in the task's team
  if (user.role !== ROLES.ADMIN) {
    const isAssigned = task.assignedTo && task.assignedTo._id.toString() === user._id.toString();
    const team = await Team.findById(task.team._id);
    const isInTeam = team && team.members.some((m) => m.user.toString() === user._id.toString());
    
    if (!isAssigned && !isInTeam) {
      throw new ApiError(403, "Access denied. You do not have permission to view this task.");
    }
  }

  return task;
};

const updateTask = async (taskId, updateData, user) => {
  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(404, "Task not found");

  const team = await Team.findById(task.team);

  // Status updates: if assigned to someone, only they can update. If unassigned, any team member can update.
  if (updateData.status && user.role !== ROLES.ADMIN) {
    if (task.assignedTo && task.assignedTo.toString() !== user._id.toString()) {
      throw new ApiError(403, "Only the assigned user can update the task status");
    }
    if (!task.assignedTo) {
      const isInTeam = team.members.some((m) => m.user.toString() === user._id.toString());
      if (!isInTeam) throw new ApiError(403, "You must be a member of the team to update this unassigned task");
    }
  }

  // Prevent members from updating fields other than status
  if (user.role !== ROLES.ADMIN) {
    const allowedUpdates = ["status"];
    const requestedUpdates = Object.keys(updateData);
    const isOnlyStatus = requestedUpdates.every(key => allowedUpdates.includes(key));
    if (!isOnlyStatus) {
      throw new ApiError(403, "Members can only update task status");
    }
  }

  // Admin changing assignee
  if (user.role === ROLES.ADMIN && updateData.assignedTo && updateData.assignedTo !== (task.assignedTo?.toString() || "")) {
    const newAssigneeId = updateData.assignedTo;
    const targetTeam = await Team.findById(updateData.team || task.team);
    const isMember = targetTeam.members.some((m) => m.user.toString() === newAssigneeId.toString());
    if (!isMember) {
      throw new ApiError(400, "New assignee must be a member of the task's team");
    }
  }

  // If Admin changes the team, validate the team
  if (user.role === ROLES.ADMIN && updateData.team && updateData.team !== task.team.toString()) {
     const newTeam = await Team.findById(updateData.team);
     if (!newTeam) throw new ApiError(404, "New team not found");
     if (newTeam.project.toString() !== task.project.toString()) {
       throw new ApiError(400, "New team must belong to the same project");
     }
     
     // If changing team and there is an assignee (either remaining or newly provided)
     const futureAssignee = updateData.assignedTo !== undefined ? updateData.assignedTo : task.assignedTo;
     if (futureAssignee) {
       const isMember = newTeam.members.some((m) => m.user.toString() === futureAssignee.toString());
       if (!isMember) throw new ApiError(400, "Assignee must be a member of the new team");
     }
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
    new: true,
    runValidators: true,
  }).populate([
    { path: "project", select: "title" },
    { path: "team", select: "name" },
    { path: "assignedTo", select: "name email role" },
    { path: "createdBy", select: "name email role" },
  ]);

  return updatedTask;
};

const deleteTask = async (taskId) => {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  return task;
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
