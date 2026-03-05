const express = require("express");
const controller = require("../controllers/predictionController");
const { protect, authorize } = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/generate", protect, authorize("ADMIN"), controller.generateInflowPrediction);
router.get("/", protect, authorize("ADMIN", "ANALYST"), controller.getInflowPredictions);

module.exports = router;