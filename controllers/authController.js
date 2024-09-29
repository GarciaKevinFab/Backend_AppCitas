import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Doctor from '../models/doctor.js';
import dotenv from 'dotenv';

dotenv.config();

// Registro de usuarios
export const register = async (req, res) => {
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

    if (role === 'Doctor') {
        const doctor = new Doctor({
            userId: user._id,
            specialty,
            availableDays,
            availableHours
        });
        await doctor.save();
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, userId: user._id, role: user.role });
};

// Inicio de sesión
export const login = async (req, res) => {
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
};
