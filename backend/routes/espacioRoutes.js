const express = require('express');
const db = require('../db/database');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// --- OBTENER TODOS LOS ESPACIOS DISPONIBLES ---
// Esta ruta es pública, no requiere autenticación para ver los espacios.
router.get('/', (req, res) => {
  // Se hace un JOIN para obtener también el nombre del tipo de espacio
  const query = `
    SELECT e.*, te.nombre AS tipo_espacio_nombre 
    FROM Espacio e
    JOIN Tipo_Espacio te ON e.id_tipo_espacio = te.id_tipo_espacio
    WHERE e.estado = TRUE
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Error al obtener los espacios.' });
    }
    res.json(results);
  });
});

// --- OBTENER UN ESPACIO ESPECÍFICO POR ID ---
// También pública.
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT e.*, te.nombre AS tipo_espacio_nombre 
        FROM Espacio e
        JOIN Tipo_Espacio te ON e.id_tipo_espacio = te.id_tipo_espacio
        WHERE e.id_espacio = ? AND e.estado = TRUE
    `;
  
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Error al obtener el espacio.' });
      }
      if (results.length === 0) {
          return res.status(404).json({ msg: 'Espacio no encontrado o no disponible.' });
      }
      res.json(results[0]);
    });
  });

// Aquí se podrían añadir rutas para CRUD de espacios (POST, PUT, DELETE),
// pero requerirían un middleware de autorización para administradores.

module.exports = router;