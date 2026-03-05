const express = require("express");
const controller = require("../controllers/alertController");
const { protect, authorize } = require("../middleware/authMiddleware");


const router = express.Router();

router.get("/", controller.getActiveAlerts);
router.post("/check", controller.triggerAlertCheck);
router.put("/:id/resolve", protect, authorize("ADMIN"), controller.resolveAlert);

module.exports = router;