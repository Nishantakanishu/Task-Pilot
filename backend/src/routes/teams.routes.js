const express = require("express");
const { getAllUserTeamsHandler } = require("../controllers/projectTeam.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

// GET /api/teams (global view across workspaces)
router.get("/", getAllUserTeamsHandler);

module.exports = router;
