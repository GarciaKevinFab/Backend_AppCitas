const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialty: { type: String, required: true },
    availableDays: { type: [String], required: true }, // Lista de días disponibles
    availableHours: { type: [String], required: true }, // Lista de horas disponibles
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
