const express = require('express');
const pool = require('../db');

const router = express.Router();

function requiereSesion(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Debes iniciar sesión para continuar.' });
  }
  return next();
}

router.use(requiereSesion);

router.post('/', async (req, res) => {
  const { fecha, hora, motivo } = req.body;
  const parsedDate = typeof fecha === 'string' ? new Date(`${fecha}T00:00:00Z`) : null;
  const ahora = new Date();
  const hoy = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`;
  if (!parsedDate || Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== fecha) {
    return res.status(400).json({ error: 'La fecha es obligatoria y debe ser válida.' });
  }
  if (fecha < hoy) {
    return res.status(400).json({ error: 'La fecha no puede ser anterior a hoy.' });
  }
  if (typeof hora !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
    return res.status(400).json({ error: 'La hora es obligatoria y debe ser válida.' });
  }
  if (hora < '09:00' || hora > '17:00') {
    return res.status(400).json({ error: 'La hora debe estar entre 09:00 y 17:00.' });
  }
  if (typeof motivo !== 'string' || !motivo.trim()) {
    return res.status(400).json({ error: 'El motivo es obligatorio.' });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO reservas (usuario_id, fecha, hora, motivo, estado)
       VALUES ($1, $2, $3, $4, 'Confirmada')
       RETURNING id, fecha, hora, motivo, estado, fecha_creacion`,
      [req.session.userId, fecha, hora, typeof motivo === 'string' ? motivo.trim() : '']
    );
    return res.status(201).json({ message: 'Reserva confirmada correctamente.', reserva: resultado.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ya tienes una reserva para esa fecha y hora.' });
    }
    console.error('Error en POST /api/reservas:', error);
    return res.status(500).json({ error: 'No fue posible crear la reserva.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query(
      `SELECT id, fecha, hora, motivo, estado, fecha_creacion
       FROM reservas
       WHERE usuario_id = $1
        ORDER BY fecha ASC, hora ASC
        LIMIT 10`,
      [req.session.userId]
    );
    return res.status(200).json({ reservas: resultado.rows });
  } catch (error) {
    console.error('Error en GET /api/reservas:', error);
    return res.status(500).json({ error: 'No fue posible consultar las reservas.' });
  }
});

module.exports = router;
