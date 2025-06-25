const express = require('express');
const cors = require('cors'); // Importa cors
const authRoutes = require('./routes/auth');
const spacesRoutes = require('./routes/spaces');
const bookingsRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Permite a la aplicación parsear JSON en el cuerpo de las solicitudes

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/spaces', spacesRoutes);
app.use('/api/bookings', bookingsRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Gestión de Reservas funcionando!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});