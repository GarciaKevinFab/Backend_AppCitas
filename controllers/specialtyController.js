import Specialty from '../models/specialty.js';
import Doctor from '../models/doctor.js';

// Obtener lista de especialidades
export const getSpecialties = async (req, res) => {
    const specialties = await Specialty.find();
    res.status(200).send(specialties);
};

// Recomendación de especialidades
export const getRecommendation = async (req, res) => {
    const { complaint } = req.body;

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

    const doctors = await Doctor.find({ specialty }).populate('userId', 'name');
    if (!doctors.length) {
        return res.status(404).send({ specialty, doctors: [] });
    }

    res.status(200).send({
        specialty,
        doctors: doctors.map(doctor => ({
            name: doctor.userId.name,
            availableDays: doctor.availableDays || [],
            availableHours: doctor.availableHours || []
        }))
    });
};
