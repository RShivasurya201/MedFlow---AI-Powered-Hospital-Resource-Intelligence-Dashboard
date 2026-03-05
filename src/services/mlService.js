const axios = require("axios");

const predictIcuRisk = async (patient) => {
  const response = await axios.post(
    "http://localhost:8000/predict-icu-risk",
    {
      age: patient.age,
      severity_score: patient.severityScore,
      oxygen_level: patient.oxygenLevel,
      heart_rate: patient.heartRate,
      comorbidities: patient.comorbiditiesCount
    }
  );
  // console.log(response.data.risk);
  return response.data.risk;
};

module.exports = { predictIcuRisk };