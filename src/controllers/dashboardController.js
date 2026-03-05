const Resource = require("../models/Resource");
const Alert = require("../models/Alert");
const Prediction = require("../models/Prediction");
const Patient = require("../models/Patient");

exports.getDashboardData = async (req, res) => {
  try {
    const resource = await Resource.findOne();
    const alerts = await Alert.find({ isResolved: false });
    const latestPrediction = await Prediction.findOne()
      .sort({ generatedAt: -1 });

    // Active patients only
    const activeFilter = { status: { $ne: "discharged" } };

    const totalPatients = await Patient.countDocuments(activeFilter);

    const icuPatients = await Patient.countDocuments({
      ...activeFilter,
      assignedBedType: "ICU"
    });

    const generalPatients = await Patient.countDocuments({
      ...activeFilter,
      assignedBedType: "GENERAL"
    });

    const availableBeds =
      resource.totalBeds -
      (resource.icuBedsOccupied + resource.generalBedsOccupied);

    // ============================
    // 1️⃣ Severity Distribution
    // ============================

    const severityAggregation = await Patient.aggregate([
      { $match: activeFilter },
      {
        $group: {
          _id: "$severity",
          count: { $sum: 1 }
        }
      }
    ]);

    const severityDistribution = {
      mild: 0,
      moderate: 0,
      severe: 0
    };

    severityAggregation.forEach(item => {
      severityDistribution[item._id] = item.count;
    });

    // ============================
    // 2️⃣ ICU Risk Buckets
    // ============================

    const icuRiskAggregation = await Patient.aggregate([
      { $match: activeFilter },
      {
        $project: {
          bucket: {
            $switch: {
              branches: [
                {
                  case: { $lt: ["$icuRiskProbability", 0.3] },
                  then: "low"
                },
                {
                  case: {
                    $and: [
                      { $gte: ["$icuRiskProbability", 0.3] },
                      { $lt: ["$icuRiskProbability", 0.7] }
                    ]
                  },
                  then: "medium"
                }
              ],
              default: "high"
            }
          }
        }
      },
      {
        $group: {
          _id: "$bucket",
          count: { $sum: 1 }
        }
      }
    ]);

    const icuRiskBuckets = {
      low: 0,
      medium: 0,
      high: 0
    };

    icuRiskAggregation.forEach(item => {
      icuRiskBuckets[item._id] = item.count;
    });

    // ============================
    // 3️⃣ Hourly Avg Severity Trend
    // ============================

    // ============================
// 3️⃣ Hourly Avg Severity Trend (Last 6 Hours)
// ============================

const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

const severityTrendAggregation = await Patient.aggregate([
  {
    $match: {
      ...activeFilter,
      admissionTime: { $gte: sixHoursAgo }
    }
  },
  {
    $group: {
      _id: {
        hour: {
          $dateToString: {
            format: "%H:00",
            date: "$admissionTime"
          }
        }
      },
      avgSeverity: { $avg: "$severityScore" }
    }
  },
  {
    $sort: { "_id.hour": 1 }
  }
]);

const severityTrend = severityTrendAggregation.map(item => ({
  hour: item._id.hour,
  avgSeverity: Number(item.avgSeverity.toFixed(2))
}));

    // ============================

    res.json({
      resources: resource,
      capacity: { availableBeds },
      alerts,
      latestPrediction,
      patientStats: {
        totalPatients,
        icuPatients,
        generalPatients
      },
      severityDistribution,
      icuRiskBuckets,
      severityTrend
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};