const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/registro', async (req, res) => {
  const { nombre, apellido, email, password, confirmPassword } = req.body;
  const nombreNormalizado = typeof nombre === 'string' ? nombre.trim() : '';
  const apellidoNormalizado = typeof apellido === 'string' ? apellido.trim() : '';
  const emailNormalizado = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!nombreNormalizado) {
    return res.status(400).json({ error: 'El nombre es obligatorio.' });
  }
  if (!apellidoNormalizado) {
    return res.status(400).json({ error: 'El apellido es obligatorio.' });
  }
  if (!emailNormalizado) {
    return res.status(400).json({ error: 'El correo electrónico es obligatorio.' });
  }
  if (!EMAIL_REGEX.test(emailNormalizado)) {
    return res.status(400).json({ error: 'El correo electrónico no tiene un formato válido.' });
  }
  if (typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'La contraseña es obligatoria.' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener como mínimo 8 caracteres.' });
  }
  if (confirmPassword !== password) {
    return res.status(400).json({ error: 'La confirmación de contraseña no coincide.' });
  }

  try {
    const existente = await pool.query('SELECT id FROM usuarios WHERE LOWER(BTRIM(email)) = $1', [emailNormalizado]);
    if (existente.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe una cuenta registrada con ese correo electrónico.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, apellido, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, apellido, email, created_at`,
      [nombreNormalizado, apellidoNormalizado, emailNormalizado, hash]
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
  const emailNormalizado = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!emailNormalizado) {
    return res.status(400).json({ error: 'El correo electrónico es obligatorio.' });
  }
  if (typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'La contraseña es obligatoria.' });
  }

  try {
    const resultado = await pool.query('SELECT * FROM usuarios WHERE LOWER(BTRIM(email)) = $1', [emailNormalizado]);
    if (resultado.rows.length === 0) {
      return res.status(401).json({ error: 'El correo electrónico o la contraseña no son válidos.' });
    }

    const usuario = resultado.rows[0];
    const coincide = await bcrypt.compare(password, usuario.password);
    if (!coincide) {
      return res.status(401).json({ error: 'El correo electrónico o la contraseña no son válidos.' });
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
    res.clearCookie('connect.sid');
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
