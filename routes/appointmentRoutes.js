const express = require('express');
const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Obtener citas del doctor autenticado
router.get('/doctorAppointments', authMiddleware, async (req, res) => {
    if (req.user.role !== 'Doctor') {
        return res.status(403).send('Acceso denegado. Solo los doctores pueden acceder a esta ruta.');
    }

    const doctor = await Doctor.findOne({ userId: req.user.userId }).populate('userId');
    if (!doctor) {
        return res.status(404).send('Doctor no encontrado');
    }

    const appointments = await Appointment.find({ doctorName: doctor.userId.name });
    res.status(200).send(appointments);
});

// Obtener citas del paciente autenticado
router.get('/patientAppointments', authMiddleware, async (req, res) => {
    if (req.user.role !== 'Paciente') {
        return res.status(403).send('Acceso denegado. Solo los pacientes pueden acceder a esta ruta.');
    }

    const appointments = await Appointment.find({ patientId: req.user.userId });
    res.status(200).send(appointments);
});

// Crear una nueva cita médica
router.post('/appointments', authMiddleware, async (req, res) => {
    const { patientId, patientName, doctorName, date, time } = req.body;

    if (!patientId || !patientName || !doctorName || !date || !time) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    try {
        const doctor = await Doctor.findOne({ userId: doctorName }).populate('userId');
        if (!doctor) {
            return res.status(404).send('Doctor no encontrado');
        }

        const appointment = new Appointment({
            patientId,
            patientName,
            doctorName: doctor.userId.name,
            date,
            time
        });

        await appointment.save();
        res.status(201).send('Cita creada exitosamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear la cita');
    }
});

module.exports = router;
