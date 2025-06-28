const express = require('express');
const db = require('../db/database');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Todas las rutas de reservas están protegidas y requieren un token válido.
router.use(authMiddleware);

// --- OBTENER LAS RESERVAS DEL USUARIO AUTENTICADO ---
router.get('/mis-reservas', (req, res) => {
  const userId = req.user.id;
  
  // Se hace un JOIN con Espacio y Estado_Reserva para obtener más detalles
  const query = `
    SELECT 
      r.id_reserva, 
      r.fecha_reserva, 
      r.hora_inicio, 
      r.hora_fin, 
      e.nombre AS nombre_espacio,
      e.ubicacion,
      er.nombre AS estado_reserva
    FROM Reserva r
    JOIN Espacio e ON r.id_espacio = e.id_espacio
    JOIN Estado_Reserva er ON r.id_estado_reserva = er.id_estado_reserva
    WHERE r.id_usuario = ? AND er.nombre != 'Cancelada'
    ORDER BY r.fecha_reserva, r.hora_inicio;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Error al obtener las reservas.' });
    }
    res.json(results);
  });
});

// --- CREAR UNA NUEVA RESERVA ---
router.post('/', (req, res) => {
  const userId = req.user.id;
  const { id_espacio, fecha_reserva, hora_inicio, hora_fin } = req.body;

  // Validación simple
  if (!id_espacio || !fecha_reserva || !hora_inicio || !hora_fin) {
    return res.status(400).json({ msg: 'Todos los campos son obligatorios.' });
  }

  // Lógica de validación de solapamiento (ejemplo simple)
  // Una implementación más robusta verificaría rangos de tiempo.
  const checkOverlapQuery = `
    SELECT * FROM Reserva 
    WHERE id_espacio = ? 
    AND fecha_reserva = ? 
    AND id_estado_reserva != 2 -- Excluir canceladas (asumiendo id 2 = Cancelada)
    AND (
      (hora_inicio < ? AND hora_fin > ?) OR
      (hora_inicio >= ? AND hora_inicio < ?)
    )
  `;

  db.query(checkOverlapQuery, [id_espacio, fecha_reserva, hora_fin, hora_inicio, hora_inicio, hora_fin], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Error al verificar disponibilidad.' });
    }

    if (results.length > 0) {
      return res.status(409).json({ msg: 'El espacio ya está reservado en el horario seleccionado.' });
    }

    // Si no hay solapamiento, crear la reserva
    const idEstadoConfirmada = 1; // Asumiendo que 1 es 'Confirmada'
    const newReserva = {
      id_usuario: userId,
      id_espacio,
      fecha_reserva,
      hora_inicio,
      hora_fin,
      id_estado_reserva: idEstadoConfirmada
    };

    db.query('INSERT INTO Reserva SET ?', newReserva, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Error al crear la reserva.' });
      }
      res.status(201).json({ msg: 'Reserva creada exitosamente.' });
    });
  });
});


// --- CANCELAR UNA RESERVA ---
router.patch('/cancelar/:id_reserva', (req, res) => {
  const userId = req.user.id;
  const { id_reserva } = req.params;
  const idEstadoCancelada = 2; // Asumiendo que el ID 2 es 'Cancelada'

  // El query verifica que la reserva pertenezca al usuario que intenta cancelarla
  const query = `
    UPDATE Reserva 
    SET id_estado_reserva = ? 
    WHERE id_reserva = ? AND id_usuario = ?
  `;

  db.query(query, [idEstadoCancelada, id_reserva, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Error al cancelar la reserva.' });
    }
    
    // `affectedRows` nos dice si alguna fila fue actualizada.
    // Si es 0, significa que la reserva no existe o no pertenece al usuario.
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Reserva no encontrada o no tienes permiso para cancelarla.' });
    }

    res.json({ msg: 'Reserva cancelada exitosamente.' });
  });
});


module.exports = router;
