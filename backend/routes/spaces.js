const express = require('express');
const pool = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los espacios
router.get('/', async (req, res) => {
    try {
        const [spaces] = await pool.query('SELECT * FROM spaces');
        res.json(spaces);
    } catch (error) {
        console.error('Error al obtener espacios:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
});

// Obtener un espacio por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [space] = await pool.query('SELECT * FROM spaces WHERE id = ?', [id]);
        if (space.length === 0) {
            return res.status(404).json({ message: 'Espacio no encontrado.' });
        }
        res.json(space[0]);
    } catch (error) {
        console.error('Error al obtener espacio por ID:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
});

// Crear un nuevo espacio (solo admin)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { name, description, capacity, type, location, price_per_hour } = req.body;

    if (!name || !capacity || !price_per_hour) {
        return res.status(400).json({ message: 'Nombre, capacidad y precio por hora son obligatorios.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO spaces (name, description, capacity, type, location, price_per_hour) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, capacity, type, location, price_per_hour]
        );
        res.status(201).json({ message: 'Espacio creado exitosamente.', id: result.insertId });
    } catch (error) {
        console.error('Error al crear espacio:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
});

// Actualizar un espacio (solo admin)
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const { name, description, capacity, type, location, price_per_hour } = req.body;

    if (!name || !capacity || !price_per_hour) {
        return res.status(400).json({ message: 'Nombre, capacidad y precio por hora son obligatorios.' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE spaces SET name = ?, description = ?, capacity = ?, type = ?, location = ?, price_per_hour = ? WHERE id = ?',
            [name, description, capacity, type, location, price_per_hour, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Espacio no encontrado.' });
        }
        res.json({ message: 'Espacio actualizado exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar espacio:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
});

// Eliminar un espacio (solo admin)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM spaces WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Espacio no encontrado.' });
        }
        res.json({ message: 'Espacio eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar espacio:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
});

module.exports = router;