const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/user');
const Specialty = require('./models/specialty');
const Doctor = require('./models/doctor');
const Appointment = require('./models/appointment');
require('dotenv').config();  // Cargar las variables de entorno

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Registro de usuarios
app.post('/api/register', async (req, res) => {
    const { name, email, password, role, specialty, lastName, availableDays, availableHours } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        lastName,
        email,
        password: hashedPassword,
        role,
    });

    await user.save();

    // Si el rol es doctor, guardamos la información adicional
    if (role === 'Doctor') {
        const doctor = new Doctor({
            userId: user._id,
            specialty,
            availableDays,
            availableHours
        });
        await doctor.save();
    }

    // Iniciar sesión automáticamente tras el registro
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, userId: user._id, role: user.role });
});

// Obtener lista de especialidades
app.get('/api/specialties', async (req, res) => {
    const specialties = await Specialty.find();
    res.status(200).send(specialties);
});

// Inicio de sesión (tanto para pacientes como doctores)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    // Buscar el usuario por correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('Usuario no encontrado');
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send('Contraseña incorrecta');
    }

    // Crear y devolver un token JWT con el rol del usuario
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, userId: user._id, role: user.role });
});

// Proteger rutas con JWT
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Acceso denegado');
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Token inválido');
    }
};

// Endpoint para recomendar especialidad y devolver doctores con horarios disponibles
app.post('/api/recommendation', authMiddleware, async (req, res) => {
    const { complaint } = req.body;

    // Implementar una lógica básica para recomendar especialidades en base a palabras clave
    let specialty;
    if (complaint.includes('dolor de cabeza')) {
        specialty = 'Neurología';
    } else if (complaint.includes('dolor de estómago')) {
        specialty = 'Gastroenterología';
    } else if (complaint.includes('fractura')) {
        specialty = 'Traumatología';
    } else if (complaint.includes('piel')) {
        specialty = 'Dermatología';
    } else if (complaint.includes('corazón')) {
        specialty = 'Cardiología';
    } else {
        specialty = 'Medicina General';
    }

    // Buscar doctores que pertenezcan a la especialidad recomendada
    const doctors = await Doctor.find({ specialty });

    if (!doctors.length) {
        return res.status(404).send('No se encontraron doctores para esta especialidad');
    }

    // Enviar la especialidad recomendada y los doctores con sus horarios disponibles
    res.status(200).send({
        specialty,
        doctors: doctors.map(doctor => ({
            name: doctor.name,
            availableDays: doctor.availableDays,
            availableHours: doctor.availableHours
        }))
    });
});

// Iniciar el servidor
app.listen(5000, () => console.log('Servidor corriendo en el puerto 5000'));
