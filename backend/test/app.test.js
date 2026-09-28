const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const pool = require('../src/db');
const app = require('../src/app');

const usuarios = [
  { id: 7, nombre: 'Ana', apellido: 'Torres', email: 'ana@example.test', password: bcrypt.hashSync('Reserva123', 4) },
  { id: 8, nombre: 'Bruno', apellido: 'Salinas', email: 'bruno@example.test', password: bcrypt.hashSync('Reserva456', 4) },
];
const reservas = [];
let siguienteReserva = 1;

pool.query = async (sql, values = []) => {
  if (sql.includes('INSERT INTO usuarios')) {
    const [nombre, apellido, email, password] = values;
    const user = { id: usuarios.length + 8, nombre, apellido, email, password, created_at: new Date() };
    usuarios.push(user);
    return { rows: [user] };
  }
  if (sql.includes('SELECT * FROM usuarios')) {
    const user = usuarios.find((item) => item.email.trim().toLowerCase() === values[0]);
    return { rows: user ? [user] : [] };
  }
  if (sql.includes('FROM usuarios') && sql.includes('LOWER(BTRIM(email))')) {
    const user = usuarios.find((item) => item.email.trim().toLowerCase() === values[0]);
    return { rows: user ? [{ id: user.id }] : [] };
  }
  if (sql.includes('INSERT INTO reservas')) {
    const [usuario_id, fecha, hora, motivo] = values;
    const reserva = { id: siguienteReserva++, usuario_id, fecha, hora, motivo, estado: 'Pendiente', fecha_creacion: new Date() };
    reservas.push(reserva);
    return { rows: [reserva] };
  }
  if (sql.includes('FROM reservas')) {
    return { rows: reservas.filter((item) => item.usuario_id === values[0]) };
  }
  throw new Error(`Consulta no simulada: ${sql}`);
};

async function withServer(callback) {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  try {
    await callback(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

test('registro rechaza contraseñas menores a 8 y confirmaciones distintas; acepta exactamente 8', async () => {
  await withServer(async (base) => {
    const registro = (password, confirmPassword, email) => fetch(`${base}/api/registro`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ nombre: 'QA', apellido: 'Prueba', email, password, confirmPassword }),
    });
    assert.equal((await registro('Abcd123', 'Abcd123', 'short@example.test')).status, 400);
    assert.equal((await registro('Abcd1234', 'Abcd1235', 'mismatch@example.test')).status, 400);
    assert.equal((await registro('Abcd1234', 'Abcd1234', 'valid@example.test')).status, 201);
    assert.equal((await registro('Abcd1234', 'Abcd1234', 'VALID@example.test')).status, 409);
  });
});

test('login incorrecto rechaza acceso y no establece cookie de sesión', async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/api/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'ana@example.test', password: 'NoEsLaClave' }),
    });
    assert.equal(response.status, 401);
    assert.match((await response.json()).error, /no son válidos/i);
    assert.equal(response.headers.get('set-cookie'), null);
  });
});

test('reservas requieren sesión y el usuario autenticado crea una reserva propia', async () => {
  await withServer(async (base) => {
    const paginaAnonima = await fetch(`${base}/agendar`, { redirect: 'manual' });
    assert.equal(paginaAnonima.status, 302);
    const anonimo = await fetch(`${base}/api/reservas`);
    assert.equal(anonimo.status, 401);

    const login = await fetch(`${base}/api/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'ana@example.test', password: 'Reserva123' }),
    });
    assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie').split(';')[0];

    const creada = await fetch(`${base}/api/reservas`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie },
      body: JSON.stringify({ fecha: '2030-05-20', hora: '10:30', motivo: 'Consulta' }),
    });
    assert.equal(creada.status, 201);
    assert.equal(reservas.at(-1).usuario_id, 7);

    const listado = await fetch(`${base}/api/reservas`, { headers: { cookie } });
    assert.equal(listado.status, 200);
    assert.equal((await listado.json()).reservas.length, 1);

    const segundoLogin = await fetch(`${base}/api/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'bruno@example.test', password: 'Reserva456' }),
    });
    const segundaCookie = segundoLogin.headers.get('set-cookie').split(';')[0];
    const reservasSegundoUsuario = await fetch(`${base}/api/reservas`, { headers: { cookie: segundaCookie } });
    assert.deepEqual((await reservasSegundoUsuario.json()).reservas, []);
  });
});
