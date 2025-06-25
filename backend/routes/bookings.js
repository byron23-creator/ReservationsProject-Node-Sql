const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Obtener mis reservas (para el usuario autenticado)
router.get('/my', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const [bookings] = await pool.query(
            'SELECT b.*, s.name as space_name, s.location FROM bookings b JOIN spaces s ON b.space_id = s.id WHERE b.user_id = ? ORDER BY b.start_time DESC',
            [userId]
        );
        res.json(bookings);
    } catch (error) {
        console.error('Error al obtener mis reservas:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
});

// Crear una nueva reserva
router.post('/', authenticateToken, async (req, res) => {
    const { space_id, start_time, end_time } = req.body;
    const userId = req.user.id;

    if (!space_id || !start_time || !end_time) {
        return res.status(400).json({ message: 'ID de espacio, hora de inicio y fin son obligatorios.' });
    }

    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    if (startTime >= endTime) {
        return res.status(400).json({ message: 'La hora de fin debe ser posterior a la hora de inicio.' });
    }

    try {
        // 1. Verificar que el espacio exista
        const [space] = await pool.query('SELECT id FROM spaces WHERE id = ?', [space_id]);
        if (space.length === 0) {
            return res.status(404).json({ message: 'El espacio no existe.' });
        }

        // 2. Verificar disponibilidad (lógica simple: no debe haber solapamientos para el mismo espacio)
        const [conflictingBookings] = await pool.query(
            'SELECT id FROM bookings WHERE space_id = ? AND status = "confirmed" AND ((? < end_time AND ? > start_time) OR (? BETWEEN start_time AND end_time) OR (? BETWEEN start_time AND end_time))',
            [space_id, start_time, end_time, start_time, end_time]
        );

        if (conflictingBookings.length > 0) {
            return res.status(409).json({ message: 'El espacio ya está reservado en ese horario.' });
        }

        // 3. Crear la reserva
        const [result] = await pool.query(
            'INSERT INTO bookings (user_id, space_id, start_time, end_time, status) VALUES (?, ?, ?, ?, ?)',
            [userId, space_id, startTime, endTime, 'confirmed']
        );
        res.status(201).json({ message: 'Reserva creada exitosamente.', id: result.insertId });
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
});

// Cancelar una reserva (solo el usuario que la creó)
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // ID del usuario autenticado

    try {
        const [booking] = await pool.query('SELECT user_id FROM bookings WHERE id = ?', [id]);

        if (booking.length === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada.' });
        }

        // Verificar que el usuario sea el propietario de la reserva
        if (booking[0].user_id !== userId) {
            return res.status(403).json({ message: 'No tienes permiso para cancelar esta reserva.' });
        }

        const [result] = await pool.query('UPDATE bookings SET status = "canceled" WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada o ya cancelada.' });
        }
        res.json({ message: 'Reserva cancelada exitosamente.' });
    } catch (error) {
        console.error('Error al cancelar reserva:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
});

module.exports = router;