const ApiError = require("../utils/ApiError");
const { verifyToken } = require("../utils/generateToken");
const User = require("../models/User.model");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Fallback: check cookie
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new ApiError(401, "Access denied. No token provided.");
  }

  // Verify token
  const decoded = verifyToken(token);

  // Attach user to request
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, "User no longer exists.");
  }

  req.user = user;
  next();
});

module.exports = { protect };
