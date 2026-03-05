const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["patient_inflow"],
    required: true
  },

  forecast: {
    type: [Number],
    required: true
  },

  generatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Prediction", predictionSchema);