const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    totalBeds: {type: Number, required: true},
    icuBedsTotal: {type: Number, required: true},
    icuBedsOccupied: {type: Number, required: true},
    generalBedsOccupied: {type: Number, required: true},
    oxygenLevel: {type: Number, required: true},
    staffAvailable: {type: Number, required: true},
    updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Resource', resourceSchema);