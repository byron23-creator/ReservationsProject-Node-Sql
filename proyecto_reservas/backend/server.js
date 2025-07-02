require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db/database'); 

const authRoutes = require('./routes/authRoutes');
const espacioRoutes = require('./routes/espacioRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/espacios', espacioRoutes);
app.use('/api/reservas', reservaRoutes);

app.get('/', (req, res) => {
  res.send('API del sistema de reservas funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error al conectar con la base de datos:', err.stack);
      return;
    }
    console.log('Conexión exitosa a la base de datos con el id ' + connection.threadId);
    connection.release();
  });
});