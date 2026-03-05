const mongoose = require("mongoose");

const patientHistorySchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true
  },

  severityScore: Number,
  oxygenLevel: Number,
  heartRate: Number,

  recordedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("PatientHistory", patientHistorySchema);
