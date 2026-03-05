const Alert = require("../models/Alert");
const Resource = require("../models/Resource");
const Prediction = require("../models/Prediction");

const generateAlerts = async () => {
  const resource = await Resource.findOne();
  if (!resource) return;

  const icuUsage =
    (resource.icuBedsOccupied / resource.icuBedsTotal) * 100;

  // ICU Alerts
  if (icuUsage >= 95) {
    await createOrUpdateAlert(
      "ICU_CAPACITY",
      "ICU capacity critically high (95%+)",
      "high"
    );
  } else if (icuUsage >= 80) {
    await createOrUpdateAlert(
      "ICU_CAPACITY",
      "ICU capacity above 80%",
      "medium"
    );
  } else {
    await resolveAlert("ICU_CAPACITY");
  }

  // Oxygen Alert
  if (resource.oxygenLevel <= 30) {
  await createOrUpdateAlert(
    "OXYGEN_LOW",
    "Oxygen level critically low",
    "high"
  );
} else if (resource.oxygenLevel <= 50) {
  await createOrUpdateAlert(
    "OXYGEN_LOW",
    "Oxygen level low",
    "medium"
  );
} else {
  await resolveAlert("OXYGEN_LOW");
}

  // Staff Alert
if (resource.staffAvailable <= 5) {
  await createOrUpdateAlert(
    "STAFF_SHORTAGE",
    "Staff availability critically low",
    "high"
  );
} else if (resource.staffAvailable <= 10) {
  await createOrUpdateAlert(
    "STAFF_SHORTAGE",
    "Staff availability low",
    "medium"
  );
} else {
  await resolveAlert("STAFF_SHORTAGE");
}
};


const createOrUpdateAlert = async (type, message, severity) => {
  const existing = await Alert.findOne({
    type,
    severity,
    isResolved: false
  });

  // If this severity alert already exists and unresolved → do nothing
  if (existing) return;

  // Otherwise create new alert document
  await Alert.create({
    type,
    message,
    severity
  });
};

const resolveAlert = async (type) => {
  await Alert.updateMany(
    { type, isResolved: false },
    { $set: { isResolved: true } }
  );
};

const checkInflowSurge = async () => {
  const resource = await Resource.findOne();
  if (!resource) return;

  const latestPrediction = await Prediction.findOne()
    .sort({ generatedAt: -1 });

  if (!latestPrediction) return;

  const availableBeds =
    resource.totalBeds -
    (resource.icuBedsOccupied + resource.generalBedsOccupied);

  const maxForecast = Math.max(...latestPrediction.forecast);

  if (maxForecast > availableBeds) {
    await createOrUpdateAlert(
      "INFLOW_SURGE",
      "Predicted inflow exceeds available bed capacity",
      "high"
    );
  } else if (maxForecast > availableBeds * 0.8) {
    await createOrUpdateAlert(
      "INFLOW_SURGE",
      "Predicted inflow nearing capacity threshold",
      "medium"
    );
  } else {
    await resolveAlert("INFLOW_SURGE");
  }
};

module.exports = { 
  generateAlerts,
  checkInflowSurge
 };