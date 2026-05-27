const express = require("express");
const { signup, login, logout, getMe, updatePassword } = require("../controllers/auth.controller");
const { signupValidator, loginValidator, changePasswordValidator } = require("../validators/auth.validator");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", signupValidator, validate, signup);

// POST /api/auth/login
router.post("/login", loginValidator, validate, login);

// POST /api/auth/logout
router.post("/logout", protect, logout);

// GET /api/auth/me
router.get("/me", protect, getMe);

// PATCH /api/auth/change-password
router.patch("/change-password", protect, changePasswordValidator, validate, updatePassword);

module.exports = router;
