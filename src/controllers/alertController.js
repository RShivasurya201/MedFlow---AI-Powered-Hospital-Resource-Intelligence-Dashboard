const Alert = require("../models/Alert");
const { generateAlerts } = require("../services/alertService");

exports.getActiveAlerts = async (req, res) => {
  const alerts = await Alert.find({ isResolved: false }).sort({ createdAt: -1 });
  res.json(alerts);
};

exports.triggerAlertCheck = async (req, res) => {
  await generateAlerts();
  res.json({ message: "Alert check completed" });
};

exports.resolveAlert = async (req, res) => {
  const { id } = req.params;

  await Alert.findByIdAndUpdate(id, { isResolved: true });

  res.json({ message: "Alert resolved successfully" });
};