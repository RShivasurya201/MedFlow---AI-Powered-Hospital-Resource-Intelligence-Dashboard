const express = require("express");
const controller = require("../controllers/patientController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/admit", protect, authorize("ADMIN"), controller.admitPatient);

router.put("/vitals/:patientId", protect, authorize("ADMIN"), controller.updateVitals);

router.put("/discharge/:patientId", protect, authorize("ADMIN"), controller.dischargePatient);

router.get("/search", controller.searchPatients);

router.get("/history/:patientId", controller.getPatientHistory);

router.get("/check/:patientId", controller.checkDuplicate);

module.exports = router;
