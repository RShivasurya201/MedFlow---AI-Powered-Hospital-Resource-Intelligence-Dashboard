const Patient = require("../models/Patient");
const PatientHistory = require("../models/patientHistory");
const Resource = require("../models/Resource");
const { allocateBed } = require("../services/bedAllocator");


exports.admitPatient = async (req, res) => {
  try {

    const existing = await Patient.findOne({ patientId: req.body.patientId });
    if (existing) {
      return res.status(400).json({
        field: "patientId",
        message: "Patient ID already exists"
      });
    }

    const patient = new Patient(req.body);

    const bedType = await allocateBed(patient);
    patient.assignedBedType = bedType;

    await patient.save();

    res.json({ message: "Patient admitted", patient });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateVitals = async (req, res) => {
  const { patientId } = req.params;

  const patient = await Patient.findOne({ patientId });

  if (!patient) return res.status(404).json({ message: "Patient not found" });

  const { severityScore, oxygenLevel, heartRate } = req.body;

  patient.severityScore = severityScore;
  patient.oxygenLevel = oxygenLevel;
  patient.heartRate = heartRate;

  await patient.save();

  await PatientHistory.create({
    patientId,
    severityScore,
    oxygenLevel,
    heartRate
  });

  res.json({ message: "Vitals updated" });
};

exports.dischargePatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findOne({ patientId });
    if (!patient)
      return res.status(404).json({ message: "Patient not found" });

    if (patient.status === "discharged")
      return res.status(400).json({ message: "Patient already discharged" });

    const resource = await Resource.findOne();
    if (!resource)
      return res.status(500).json({ message: "Resource data missing" });

    if (patient.assignedBedType === "ICU") {
      if (resource.icuBedsOccupied > 0)
        resource.icuBedsOccupied -= 1;
    }

    if (patient.assignedBedType === "GENERAL") {
      if (resource.generalBedsOccupied > 0)
        resource.generalBedsOccupied -= 1;
    }

    patient.status = "discharged";
    patient.assignedBedType = "NONE";

    await resource.save();
    await patient.save();

    res.json({ message: "Patient discharged successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchPatients = async (req, res) => {
  try {
    const {
      severity,
      ward,
      status,
      search,
      page = 1,
      limit = 10,
      sortBy = "admissionTime",
      order = "desc"
    } = req.query;

    let filter = {};

    if (severity) filter.severity = severity;
    if (ward) filter.assignedBedType = ward;
    if (status) filter.status = status;

    if (search) {
      filter.patientId = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const total = await Patient.countDocuments(filter);

    const patients = await Patient.find(filter)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      patients,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPatientHistory = async (req, res) => {
  const { patientId } = req.params;

  const history = await PatientHistory.find({ patientId }).sort({ recordedAt: 1 });

  res.json(history);
};

exports.checkDuplicate = async (req, res) => {
  const { patientId } = req.params;

  const existing = await Patient.findOne({ patientId });

  res.json({ exists: !!existing });
};