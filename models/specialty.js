const mongoose = require('mongoose');

const specialtySchema = new mongoose.Schema({
    name: { type: String, required: true }
});

const Specialty = mongoose.model('Specialty', specialtySchema);
module.exports = Specialty;
