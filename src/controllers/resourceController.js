const Resource = require("../models/Resource");


// SET OR UPDATE RESOURCES
// simple validation helper that returns a string error or null
function validateResourceData(data) {
  const {
    totalBeds,
    icuBedsTotal,
    icuBedsOccupied,
    generalBedsOccupied,
    oxygenLevel,
    staffAvailable
  } = data;

  // convenience to treat undefined as the current values; caller
  // can supply partial objects when updating existing doc
  const isNumber = (n) => typeof n === 'number' && !isNaN(n);

  if (totalBeds !== undefined && !isNumber(totalBeds))
    return 'totalBeds must be a number';
  if (icuBedsTotal !== undefined && !isNumber(icuBedsTotal))
    return 'icuBedsTotal must be a number';
  if (icuBedsOccupied !== undefined && !isNumber(icuBedsOccupied))
    return 'icuBedsOccupied must be a number';
  if (generalBedsOccupied !== undefined && !isNumber(generalBedsOccupied))
    return 'generalBedsOccupied must be a number';
  if (oxygenLevel !== undefined && !isNumber(oxygenLevel))
    return 'oxygenLevel must be a number';
  if (staffAvailable !== undefined && !isNumber(staffAvailable))
    return 'staffAvailable must be a number';

  if (totalBeds !== undefined && totalBeds < 0)
    return 'totalBeds cannot be negative';
  if (icuBedsTotal !== undefined && icuBedsTotal < 0)
    return 'icuBedsTotal cannot be negative';
  if (icuBedsOccupied !== undefined && icuBedsOccupied < 0)
    return 'icuBedsOccupied cannot be negative';
  if (generalBedsOccupied !== undefined && generalBedsOccupied < 0)
    return 'generalBedsOccupied cannot be negative';
  if (oxygenLevel !== undefined && (oxygenLevel < 0 || oxygenLevel > 100))
    return 'oxygenLevel must be between 0 and 100';
  if (staffAvailable !== undefined && staffAvailable < 0)
    return 'staffAvailable cannot be negative';

  if (
    totalBeds !== undefined &&
    icuBedsTotal !== undefined &&
    totalBeds < icuBedsTotal
  )
    return 'totalBeds must be greater than or equal to icuBedsTotal';

  if (
    icuBedsOccupied !== undefined &&
    icuBedsTotal !== undefined &&
    icuBedsOccupied > icuBedsTotal
  )
    return 'icuBedsOccupied cannot exceed icuBedsTotal';

  if (
    generalBedsOccupied !== undefined &&
    totalBeds !== undefined &&
    icuBedsTotal !== undefined &&
    generalBedsOccupied > totalBeds - icuBedsTotal
  )
    return 'generalBedsOccupied cannot exceed available general beds (totalBeds - icuBedsTotal)';

  return null;
}

exports.setResources = async (req, res) => {
  try {
    const data = req.body;

    const validationError = validateResourceData(data);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    let resource = await Resource.findOne();

    if (resource) {
      Object.assign(resource, data);
      // re-run validation against full document in case some fields
      // were omitted from the request
      const mergedError = validateResourceData(resource.toObject());
      if (mergedError) {
        return res.status(400).json({ message: mergedError });
      }
      await resource.save();
    } else {
      resource = await Resource.create(data);
    }

    res.json({
      message: "Hospital resources updated",
      resource
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET CURRENT RESOURCE STATUS
exports.getResources = async (req, res) => {
  try {
    const resource = await Resource.findOne();

    if (!resource)
      return res.status(404).json({ message: "No resource data found" });

    res.json(resource);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET CAPACITY SUMMARY (very useful)
exports.getCapacityStats = async (req, res) => {
  try {
    const resource = await Resource.findOne();

    if (!resource)
      return res.status(404).json({ message: "No resource data found" });

    const icuAvailable =
      resource.icuBedsTotal - resource.icuBedsOccupied;

    const generalCapacity =
      resource.totalBeds - resource.icuBedsTotal;

    const generalAvailable =
      generalCapacity - resource.generalBedsOccupied;

    res.json({
      icu: {
        total: resource.icuBedsTotal,
        occupied: resource.icuBedsOccupied,
        available: icuAvailable
      },
      general: {
        total: generalCapacity,
        occupied: resource.generalBedsOccupied,
        available: generalAvailable
      },
      oxygenLevel: resource.oxygenLevel,
      staffAvailable: resource.staffAvailable
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};