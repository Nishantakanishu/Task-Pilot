const asyncHandler = require("../utils/asyncHandler");
const { getDashboardData } = require("../services/dashboard.service");

const getDashboardDataHandler = asyncHandler(async (req, res) => {
  const data = await getDashboardData(req.user);

  res.status(200).json({
    success: true,
    message: "Dashboard data fetched successfully",
    data,
  });
});

module.exports = {
  getDashboardDataHandler,
};
