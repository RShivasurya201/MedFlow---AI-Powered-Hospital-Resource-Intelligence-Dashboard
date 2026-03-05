const cron = require("node-cron");
const { generateAlerts } = require("../services/alertService");

const startAlertScheduler = () => {
  // Runs every 30 seconds
  cron.schedule("*/30 * * * * *", async () => {
    console.log("Running scheduled alert check...");
    await generateAlerts();
  });
};

module.exports = { startAlertScheduler };