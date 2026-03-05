const axios = require("axios");
const Prediction = require("../models/Prediction");
const { generateMockInflow } = require("../mockData/mockInflow");

const fetchAndStoreInflowPrediction = async () => {
  const history = generateMockInflow();

  const response = await axios.post(
    "http://localhost:8000/predict-inflow",
    { history }
  );

  const forecast = response.data.forecast;

  const prediction = await Prediction.create({
    type: "patient_inflow",
    forecast
  });

  // 🔥 CLEANUP: Keep only latest 100 predictions
  const count = await Prediction.countDocuments();

  if (count > 100) {
    const excess = count - 100;

    const oldPredictions = await Prediction.find()
      .sort({ generatedAt: 1 })
      .limit(excess);

    const idsToDelete = oldPredictions.map(p => p._id);

    await Prediction.deleteMany({ _id: { $in: idsToDelete } });
  }

  return prediction;
};

module.exports = { fetchAndStoreInflowPrediction }