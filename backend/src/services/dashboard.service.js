const { Task, STATUS } = require("../models/Task.model");
const Project = require("../models/Project.model");
const Team = require("../models/Team.model");
const ROLES = require("../constants/roles");

const getDashboardData = async (user) => {
  const isAdmin = user.role === ROLES.ADMIN;
  const now = new Date();

  // Base query for tasks depending on role
  const taskQuery = isAdmin ? {} : { assignedTo: user._id };

  // Fetch counts in parallel for performance
  const [
    totalProjects,
    totalTeams,
    totalTasks,
    completedTasks,
    overdueTasks,
    recentTasks,
    activeProjects,
    activeTeams
  ] = await Promise.all([
    // Projects count (admin sees all, member sees assigned)
    isAdmin 
      ? Project.countDocuments() 
      : Project.countDocuments({ members: user._id }),
      
    // Teams count
    isAdmin
      ? Team.countDocuments()
      : Team.countDocuments({ "members.user": user._id }),
    
    // Total tasks
    Task.countDocuments(taskQuery),
    
    // Completed tasks
    Task.countDocuments({ ...taskQuery, status: STATUS.DONE }),
    
    // Overdue tasks
    Task.countDocuments({
      ...taskQuery,
      status: { $ne: STATUS.DONE },
      dueDate: { $lt: now }
    }),
    
    // Recent tasks
    Task.find(taskQuery)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("project", "title")
      .populate("team", "name")
      .populate("assignedTo", "name"),
      
    // Active Projects (recently created)
    isAdmin
      ? Project.find().sort({ createdAt: -1 }).limit(5)
      : Project.find({ members: user._id }).sort({ createdAt: -1 }).limit(5),
      
    // Active Teams (recently created)
    isAdmin
      ? Team.find().sort({ createdAt: -1 }).limit(5).populate("project", "title")
      : Team.find({ "members.user": user._id }).sort({ createdAt: -1 }).limit(5).populate("project", "title")
  ]);

  const pendingTasks = totalTasks - completedTasks;

  // Additional detail for overdue tasks (to show in the alert list)
  const overdueTasksList = await Task.find({
    ...taskQuery,
    status: { $ne: STATUS.DONE },
    dueDate: { $lt: now }
  })
    .sort({ dueDate: 1 })
    .populate("project", "title");

  return {
    stats: {
      totalProjects,
      totalTeams,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks
    },
    recentTasks,
    activeProjects,
    activeTeams,
    overdueTasksList
  };
};

module.exports = {
  getDashboardData
};
