const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  // Cargar las variables de entorno

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Importar las rutas
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const specialtyRoutes = require('./routes/specialtyRoutes');

// Usar las rutas
app.use('/api', authRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', specialtyRoutes);

app.listen(5000, () => console.log('Servidor corriendo en el puerto 5000'));
