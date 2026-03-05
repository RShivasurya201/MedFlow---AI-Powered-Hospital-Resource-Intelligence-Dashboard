const Resource = require("../models/Resource");
const { predictIcuRisk } = require("./mlService");

const allocateBed = async (patient) => {
  const resource = await Resource.findOne();
  if (!resource) {
    throw new Error("Hospital resources not configured");
  }

  // If critical → ICU directly (if available)
  if (patient.severity === "severe") {
    if (resource.icuBedsOccupied >= resource.icuBedsTotal) {
      throw new Error("No ICU beds available");
    }

    resource.icuBedsOccupied += 1;
    patient.icuRiskProbability = 1;
    await resource.save();
    return "ICU";
  }

  // Otherwise check ML risk
  const risk = await predictIcuRisk(patient);
  patient.icuRiskProbability = risk;
  
  if (
    risk > 0.7 &&
    resource.icuBedsOccupied < resource.icuBedsTotal
  ) {
    resource.icuBedsOccupied += 1;
    await resource.save();
    return "ICU";
  }

  // Assign GENERAL
  const generalCapacity =
    resource.totalBeds - resource.icuBedsTotal;

  if (resource.generalBedsOccupied >= generalCapacity) {
    throw new Error("No General beds available");
  }

  resource.generalBedsOccupied += 1;
  await resource.save();

  return "GENERAL";
};

module.exports = { allocateBed };