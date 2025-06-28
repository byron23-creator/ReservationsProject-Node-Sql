// Cargar las variables de entorno desde el archivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db/database'); // Importa la conexión a la base de datos

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const espacioRoutes = require('./routes/espacioRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

// Crear la aplicación de Express
const app = express();
const PORT = process.env.API_PORT || 3001;

// Middlewares
app.use(cors()); // Habilita CORS para permitir peticiones desde el frontend
app.use(express.json()); // Permite al servidor entender JSON en el cuerpo de las peticiones

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/espacios', espacioRoutes);
app.use('/api/reservas', reservaRoutes);

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('API del sistema de reservas funcionando!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  // Opcional: Probar la conexión a la base de datos al iniciar
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error al conectar con la base de datos:', err.stack);
      return;
    }
    console.log('Conexión exitosa a la base de datos con el id ' + connection.threadId);
    connection.release(); // Liberar la conexión
  });
});