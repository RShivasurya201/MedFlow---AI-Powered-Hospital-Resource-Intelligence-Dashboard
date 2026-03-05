const express = require("express");
const controller = require("../controllers/dashboardController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("ADMIN", "ANALYST"),
  controller.getDashboardData
);

module.exports = router;