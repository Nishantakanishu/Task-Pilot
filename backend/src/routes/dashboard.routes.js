const express = require("express");
const { getDashboardDataHandler } = require("../controllers/dashboard.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// Dashboard route requires authentication
router.use(protect);

// GET /api/dashboard
router.get("/", getDashboardDataHandler);

module.exports = router;
