const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Doctor = require('../models/doctor');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();  // Cargar variables de entorno

const router = express.Router();

// Registro de usuarios
router.post('/register', async (req, res) => {
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

// Inicio de sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('Usuario no encontrado');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send('Contraseña incorrecta');
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, userId: user._id, role: user.role });
});

module.exports = router;
