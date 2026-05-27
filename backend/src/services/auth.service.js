const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const { generateToken } = require("../utils/generateToken");
const { DEMO_USER, ensureDemoUser } = require("../utils/seedDemoUser");

const registerUser = async ({ name, email, password }) => {
  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  // Role is NOT accepted from outside — model default (MEMBER) is always applied
  const user = await User.create({ name, email, password });

  // Generate token
  const token = generateToken({ id: user._id, role: user.role });

  return { user, token };
};

const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  // Keep the demo admin self-healing so a stale or duplicated production record
  // cannot block access after a deployment.
  if (normalizedEmail === DEMO_USER.email) {
    await ensureDemoUser();
  }

  // Find user (explicitly select password since select:false in schema)
  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate token
  const token = generateToken({ id: user._id, role: user.role });

  return { user, token };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return getCurrentUser(userId);
};

module.exports = { registerUser, loginUser, getCurrentUser, changePassword };
