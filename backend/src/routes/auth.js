const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');

const router = express.Router();

const EMAIL_REGEX = /^[^@]+@[^@]+\.[^@]+$/;

router.post('/registro', async (req, res) => {
  const { nombre, apellido, email, password } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio.' });
  }
  if (!apellido) {
    return res.status(400).json({ error: 'El apellido es obligatorio.' });
  }
  if (!email) {
    return res.status(400).json({ error: 'El correo electrónico es obligatorio.' });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'El correo electrónico no tiene un formato válido.' });
  }
  if (!password) {
    return res.status(400).json({ error: 'La contraseña es obligatoria.' });
  }
  if (password.length <= 8) {
    return res.status(400).json({ error: 'La contraseña debe tener como mínimo 8 caracteres.' });
  }

  try {
    const existente = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existente.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe una cuenta registrada con ese correo electrónico.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, apellido, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, apellido, email, created_at`,
      [nombre, apellido, email, hash]
    );

    return res.status(201).json({
      message: 'Cuenta creada correctamente. Ahora puedes iniciar sesión.',
      usuario: resultado.rows[0],
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ya existe una cuenta registrada con ese correo electrónico.' });
    }
    console.error('Error en /registro:', error);
    return res.status(500).json({ error: 'Ocurrió un error al crear la cuenta. Intenta nuevamente.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'El correo electrónico es obligatorio.' });
  }
  if (!password) {
    return res.status(400).json({ error: 'La contraseña es obligatoria.' });
  }

  try {
    const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (resultado.rows.length === 0) {
      return res.status(401).json({ error: 'No existe una cuenta registrada con ese correo electrónico.' });
    }

    const usuario = resultado.rows[0];
    const coincide = await bcrypt.compare(password, usuario.password);
    if (!coincide) {
      return res.status(401).json({ error: 'La contraseña ingresada es incorrecta.' });
    }

    req.session.userId = usuario.id;
    req.session.nombre = usuario.nombre;

    return res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error('Error en /login:', error);
    return res.status(500).json({ error: 'Ocurrió un error al iniciar sesión. Intenta nuevamente.' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Error en /logout:', error);
      return res.status(500).json({ error: 'No se pudo cerrar la sesión.' });
    }
    return res.status(200).json({ message: 'Sesión cerrada correctamente.' });
  });
});

router.get('/me', (req, res) => {
  if (req.session && req.session.userId) {
    return res.status(200).json({
      usuario: { id: req.session.userId, nombre: req.session.nombre },
    });
  }
  return res.status(401).json({ error: 'No hay una sesión activa.' });
});

module.exports = router;
