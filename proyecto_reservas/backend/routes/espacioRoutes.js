const express = require('express');
const db = require('../db/database');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// --- OBTENER TODOS LOS ESPACIOS DISPONIBLES ---
router.get('/', (req, res) => {
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

module.exports = router;