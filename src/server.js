require("dotenv").config({ path: "../.env" });
const app = require("./app");
const connectDB = require("./config/db");
const { startAlertScheduler } = require("./jobs/alertJob");
const { startPredictionScheduler } = require("./jobs/predictionJob");

connectDB();

startAlertScheduler();

startPredictionScheduler();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
