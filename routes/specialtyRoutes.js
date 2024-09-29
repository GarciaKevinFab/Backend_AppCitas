const express = require('express');
const Specialty = require('../models/specialty');
const Doctor = require('../models/doctor');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Obtener lista de especialidades
router.get('/specialties', async (req, res) => {
    const specialties = await Specialty.find();
    res.status(200).send(specialties);
});

// Endpoint para recomendar especialidad y devolver doctores con horarios disponibles
router.post('/recommendation', authMiddleware, async (req, res) => {
    const { complaint } = req.body;

    // Lógica para recomendar especialidad
    let specialty;
    if (complaint.includes('dolor de cabeza')) {
        specialty = 'Neurología';
    } else if (complaint.includes('dolor de estómago')) {
        specialty = 'Gastroenterología';
    } else if (complaint.includes('fractura')) {
        specialty = 'Traumatología';
    } else if (complaint.includes('piel')) {
        specialty = 'Dermatología';
    } else if (complaint.includes('corazon')) {
        specialty = 'Cardiología';
    } else {
        specialty = 'Medicina General';
    }

    // Buscar doctores que pertenezcan a la especialidad recomendada
    const doctors = await Doctor.find({ specialty }).populate('userId', 'name');
    if (!doctors.length) {
        return res.status(404).send({ specialty, doctors: [] });
    }

    // Devolver especialidad y lista de doctores
    res.status(200).send({
        specialty,
        doctors: doctors.map(doctor => ({
            name: doctor.userId.name,
            availableDays: doctor.availableDays || [],
            availableHours: doctor.availableHours || []
        }))
    });
});

module.exports = router;
