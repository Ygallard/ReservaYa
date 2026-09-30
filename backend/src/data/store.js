const usuariosIniciales = require('./test-data');

const usuarios = [];
const reservas = [];
let siguienteUsuarioId = 1;
let siguienteReservaId = 1;

function reiniciarAlmacenamiento() {
  usuarios.splice(0, usuarios.length, ...usuariosIniciales.map((usuario) => ({
    ...usuario,
    created_at: new Date(),
  })));
  reservas.length = 0;
  siguienteUsuarioId = Math.max(0, ...usuarios.map((usuario) => usuario.id)) + 1;
  siguienteReservaId = 1;
}

function buscarUsuarioPorEmail(email) {
  const normalizado = typeof email === 'string' ? email.trim().toLowerCase() : '';
  return usuarios.find((usuario) => usuario.email.trim().toLowerCase() === normalizado);
}

function crearUsuario({ nombre, apellido, email, password }) {
  if (buscarUsuarioPorEmail(email)) return null;

  const usuario = {
    id: siguienteUsuarioId++,
    nombre,
    apellido,
    email,
    password,
    created_at: new Date(),
  };
  usuarios.push(usuario);
  return usuario;
}

function crearReserva({ usuario_id, fecha, hora, motivo }) {
  const duplicada = reservas.some((reserva) =>
    reserva.usuario_id === usuario_id && reserva.fecha === fecha && reserva.hora === hora
  );
  if (duplicada) return null;

  const reserva = {
    id: siguienteReservaId++,
    usuario_id,
    fecha,
    hora,
    motivo,
    estado: 'Confirmada',
    fecha_creacion: new Date(),
  };
  reservas.push(reserva);
  return reserva;
}

function reservaPublica(reserva) {
  const { id, fecha, hora, motivo, estado, fecha_creacion } = reserva;
  return { id, fecha, hora, motivo, estado, fecha_creacion };
}

function listarReservasPorUsuario(usuarioId) {
  return reservas
    .filter((reserva) => reserva.usuario_id === usuarioId)
    .sort((primera, segunda) =>
      `${primera.fecha}${primera.hora}`.localeCompare(`${segunda.fecha}${segunda.hora}`)
    )
    .slice(0, 10)
    .map(reservaPublica);
}

reiniciarAlmacenamiento();

module.exports = {
  usuarios,
  reservas,
  buscarUsuarioPorEmail,
  crearUsuario,
  crearReserva,
  reservaPublica,
  listarReservasPorUsuario,
  reiniciarAlmacenamiento,
};