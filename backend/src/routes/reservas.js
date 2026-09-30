const express = require('express');
const store = require('../data/store');

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

  const reserva = store.crearReserva({
    usuario_id: req.session.userId,
    fecha,
    hora,
    motivo: motivo.trim(),
  });
  if (!reserva) {
    return res.status(409).json({ error: 'Ya tienes una reserva para esa fecha y hora.' });
  }
  return res.status(201).json({
    message: 'Reserva confirmada correctamente.',
    reserva: store.reservaPublica(reserva),
  });
});

router.get('/', (req, res) => {
  return res.status(200).json({ reservas: store.listarReservasPorUsuario(req.session.userId) });
});

module.exports = router;
