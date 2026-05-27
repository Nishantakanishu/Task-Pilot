const asyncHandler = require("../utils/asyncHandler");
const { registerUser, loginUser, getCurrentUser, changePassword } = require("../services/auth.service");

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { user, token } = await registerUser({ name, email, password });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: { user, token },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await loginUser({ email, password });

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: { user, token },
  });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user._id);

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});

const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  await changePassword(req.user._id, currentPassword, newPassword);

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
    data: null,
  });
});

module.exports = { signup, login, logout, getMe, updatePassword };
