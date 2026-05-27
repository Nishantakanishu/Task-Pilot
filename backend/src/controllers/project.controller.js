const asyncHandler = require("../utils/asyncHandler");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  addMember,
  removeMember,
  getAllUsers,
} = require("../services/project.service");

const createProjectHandler = asyncHandler(async (req, res) => {
  const { title, description, members } = req.body;
  const project = await createProject({ title, description, userId: req.user._id, members });

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: project,
  });
});

const getProjectsHandler = asyncHandler(async (req, res) => {
  const projects = await getProjects(req.user);

  res.status(200).json({
    success: true,
    message: "Projects fetched successfully",
    data: projects,
  });
});

const getProjectByIdHandler = asyncHandler(async (req, res) => {
  const project = await getProjectById(req.params.id, req.user);

  res.status(200).json({
    success: true,
    message: "Project fetched successfully",
    data: project,
  });
});

const updateProjectHandler = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const project = await updateProject(req.params.id, { title, description });

  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    data: project,
  });
});

const addMemberHandler = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const project = await addMember(req.params.id, userId);

  res.status(200).json({
    success: true,
    message: "Member added successfully",
    data: project,
  });
});

const removeMemberHandler = asyncHandler(async (req, res) => {
  const project = await removeMember(req.params.id, req.params.userId);

  res.status(200).json({
    success: true,
    message: "Member removed successfully",
    data: project,
  });
});

const getAllUsersHandler = asyncHandler(async (req, res) => {
  const users = await getAllUsers();

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
});

module.exports = {
  createProjectHandler,
  getProjectsHandler,
  getProjectByIdHandler,
  updateProjectHandler,
  addMemberHandler,
  removeMemberHandler,
  getAllUsersHandler,
};
