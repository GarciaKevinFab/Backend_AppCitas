import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'; // Cargar las variables de entorno

// Cargar las rutas
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import specialtyRoutes from './routes/specialtyRoutes.js';

dotenv.config();  // Cargar las variables de entorno

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Usar las rutas
app.use('/api', authRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', specialtyRoutes);

app.listen(5000, () => console.log('Servidor corriendo en el puerto 5000'));
