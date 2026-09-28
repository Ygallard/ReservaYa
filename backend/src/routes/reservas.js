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
  if (!parsedDate || Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== fecha) {
    return res.status(400).json({ error: 'La fecha es obligatoria y debe ser válida.' });
  }
  if (typeof hora !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
    return res.status(400).json({ error: 'La hora es obligatoria y debe ser válida.' });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO reservas (usuario_id, fecha, hora, motivo)
       VALUES ($1, $2, $3, $4)
       RETURNING id, fecha, hora, motivo, estado, fecha_creacion`,
      [req.session.userId, fecha, hora, typeof motivo === 'string' ? motivo.trim() : '']
    );
    return res.status(201).json({ message: 'Reserva confirmada correctamente.', reserva: resultado.rows[0] });
  } catch (error) {
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
       ORDER BY fecha DESC, hora DESC`,
      [req.session.userId]
    );
    return res.status(200).json({ reservas: resultado.rows });
  } catch (error) {
    console.error('Error en GET /api/reservas:', error);
    return res.status(500).json({ error: 'No fue posible consultar las reservas.' });
  }
});

module.exports = router;
