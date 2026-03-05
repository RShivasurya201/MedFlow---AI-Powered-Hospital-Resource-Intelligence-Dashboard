const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    patientId: {type: String, required: true, unique: true},
    name: {type: String},
    age: {type: String, required: true},
    severity: {type: String,
               enum: ['mild', 'moderate', 'severe'],
               required: true
    },
    severityScore: {type: Number, required: true},
    oxygenLevel: {type: Number, required: true},
    heartRate: {type: Number, required: true},
    comorbiditiesCount: {type: Number, required: true},

    admissionTime: { type: Date, default: Date.now },

    assignedBedType: {type: String,
               enum: ['ICU', 'GENERAL', 'NONE'],
               default: 'NONE'
    },

    icuRiskProbability: {type: Number, default: 0},

    status: {type: String,
               enum: ['admitted', 'discharged'],
               default: 'admitted'
    }

});

module.exports = mongoose.model("Patient", patientSchema);