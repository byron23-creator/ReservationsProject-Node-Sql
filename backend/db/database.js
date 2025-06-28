const mysql = require('mysql2');
require('dotenv').config();

// Crear un pool de conexiones a la base de datos usando las variables de entorno
const pool = mysql.createPool({
  connectionLimit: 10, // Número máximo de conexiones en el pool
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // Esperar si todas las conexiones están en uso
  queueLimit: 0 // Sin límite en la cola de espera
});

// Exportar el pool para que pueda ser utilizado en otras partes de la aplicación
module.exports = pool;