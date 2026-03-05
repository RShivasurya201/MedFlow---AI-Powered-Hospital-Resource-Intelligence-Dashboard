const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["ICU_CAPACITY", "STAFF_SHORTAGE", "OXYGEN_LOW", "INFLOW_SURGE"],
    required: true
  },
  message: { type: String, required: true },
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    required: true
  },
  isResolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", alertSchema);
