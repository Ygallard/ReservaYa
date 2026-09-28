require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const reservationRoutes = require('./routes/reservas');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'reservaya-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
    },
  })
);

app.use('/api', authRoutes);
app.use('/api/reservas', reservationRoutes);

const frontendPath = path.join(__dirname, '..', '..', 'frontend');

function requiereSesionPagina(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect('/index.html');
  }
  return next();
}

app.get(['/agendar', '/agendar.html'], requiereSesionPagina, (req, res) => res.sendFile(path.join(frontendPath, 'agendar.html')));
app.get(['/mis-reservas', '/mis-reservas.html'], requiereSesionPagina, (req, res) => res.sendFile(path.join(frontendPath, 'mis-reservas.html')));
app.use(express.static(frontendPath));

app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`RESERVAYA backend escuchando en http://localhost:${PORT}`);
  });
}

module.exports = app;
