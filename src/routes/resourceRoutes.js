const express = require("express");
const controller = require("../controllers/resourceController");
const { protect, authorize } = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/set", protect, authorize("ADMIN"), controller.setResources);

router.get("/", controller.getResources);

router.get("/capacity", controller.getCapacityStats);

module.exports = router;