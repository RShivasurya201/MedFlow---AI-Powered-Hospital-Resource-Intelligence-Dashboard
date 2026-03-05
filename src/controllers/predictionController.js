const Prediction = require("../models/Prediction");
const { fetchAndStoreInflowPrediction } = require("../services/predictionService");

exports.generateInflowPrediction = async (req, res) => {
  try {
    const prediction = await fetchAndStoreInflowPrediction();
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInflowPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find()
      .sort({ generatedAt: -1 })
      .limit(10);

    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};