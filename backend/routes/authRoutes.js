const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const router = express.Router();

// --- RUTA DE REGISTRO ---
router.post('/register', async (req, res) => {
  const { nombre, apellido, email, contrasena, telefono } = req.body;

  // Validación simple
  if (!nombre || !apellido || !email || !contrasena) {
    return res.status(400).json({ msg: 'Por favor, introduce todos los campos requeridos.' });
  }

  try {
    // Verificar si el email ya existe
    db.query('SELECT email FROM Usuario WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Error en el servidor al verificar email.' });
      }

      if (results.length > 0) {
        return res.status(400).json({ msg: 'El email ya está registrado.' });
      }

      // Encriptar la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(contrasena, salt);
      
      // Asignamos por defecto el tipo de usuario 'Cliente' (id=1)
      const idTipoUsuarioCliente = 1;

      // Guardar el nuevo usuario en la base de datos
      const newUser = { nombre, apellido, email, contrasena: hashedPassword, telefono, id_tipo_usuario: idTipoUsuarioCliente };
      db.query('INSERT INTO Usuario SET ?', newUser, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ msg: 'Error en el servidor al registrar usuario.' });
        }
        res.status(201).json({ msg: 'Usuario registrado exitosamente.' });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor.');
  }
});

// --- RUTA DE LOGIN ---
router.post('/login', (req, res) => {
  const { email, contrasena } = req.body;

  // Validación simple
  if (!email || !contrasena) {
    return res.status(400).json({ msg: 'Por favor, introduce email y contraseña.' });
  }

  db.query('SELECT * FROM Usuario WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Error en el servidor.' });
    }

    if (results.length === 0) {
      return res.status(400).json({ msg: 'Credenciales inválidas.' });
    }

    const user = results[0];

    // Comparar la contraseña ingresada con la almacenada (hasheada)
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas.' });
    }

    // Si las credenciales son correctas, crear y firmar el JWT
    const payload = {
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        email: user.email
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, // El token expira en 5 horas
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  });
});

module.exports = router;