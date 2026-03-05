const cron = require("node-cron");
const { fetchAndStoreInflowPrediction } = require("../services/predictionService");
const { checkInflowSurge } = require("../services/alertService");

const startPredictionScheduler = () => {
  // Every 1 minute
  cron.schedule("* * * * *", async () => {
  console.log("Running scheduled inflow prediction...");

  try {
    await fetchAndStoreInflowPrediction();
    await checkInflowSurge();

    console.log("Inflow prediction stored & surge checked.");
  } catch (error) {
    console.error("Prediction job failed:", error.message);
  }
});
};

module.exports = { startPredictionScheduler };