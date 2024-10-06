import express from 'express';
import { getDoctorAppointments, getPatientAppointments, createAppointment, markAppointmentAsAttended } from '../controllers/appointmentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/doctorAppointments', authMiddleware, getDoctorAppointments);
router.get('/patientAppointments', authMiddleware, getPatientAppointments);
router.post('/appointments', authMiddleware, createAppointment);

// Ruta para marcar la cita como atendida
router.put('/appointments/:id/attend', authMiddleware, markAppointmentAsAttended);

export default router;
