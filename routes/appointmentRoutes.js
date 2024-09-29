import express from 'express';
import { getDoctorAppointments, getPatientAppointments, createAppointment } from '../controllers/appointmentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/doctorAppointments', authMiddleware, getDoctorAppointments);
router.get('/patientAppointments', authMiddleware, getPatientAppointments);
router.post('/appointments', authMiddleware, createAppointment);

export default router;
