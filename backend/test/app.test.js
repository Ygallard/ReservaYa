const { beforeEach, test } = require('node:test');
const assert = require('node:assert/strict');
const store = require('../src/data/store');
const app = require('../src/app');

beforeEach(() => store.reiniciarAlmacenamiento());

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
    assert.equal((await registro('Abcd1234', 'Abcd1234', 'USUARIO1@RESERVAYA.CL')).status, 409);
      const segundaCuenta = await registro('Abcd1234', 'Abcd1234', 'segunda@example.test');
      assert.equal(segundaCuenta.status, 201);
      assert.notEqual((await segundaCuenta.json()).usuario.id, store.usuarios[0].id);
  });
});

test('login incorrecto rechaza acceso y no establece cookie de sesión', async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/api/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'usuario1@reservaya.cl', password: 'NoEsLaClave' }),
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
      body: JSON.stringify({ email: 'usuario1@reservaya.cl', password: 'Reserva123' }),
    });
    assert.equal(login.status, 200);
    const cookie = login.headers.get('set-cookie').split(';')[0];
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const fechaPasada = `${ayer.getFullYear()}-${String(ayer.getMonth() + 1).padStart(2, '0')}-${String(ayer.getDate()).padStart(2, '0')}`;
    const crearReserva = (fecha, hora, motivo) => fetch(`${base}/api/reservas`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie },
      body: JSON.stringify({ fecha, hora, motivo }),
    });

    assert.equal((await crearReserva(fechaPasada, '10:30', 'Consulta')).status, 400);
    assert.equal((await crearReserva('2030-05-20', '08:59', 'Consulta')).status, 400);
    assert.equal((await crearReserva('2030-05-20', '10:30', '   ')).status, 400);

    const creada = await crearReserva('2030-05-20', '10:30', 'Consulta');
    assert.equal(creada.status, 201);
    assert.equal(store.reservas.at(-1).usuario_id, 1);
    assert.equal(store.reservas.at(-1).estado, 'Confirmada');
    assert.equal((await crearReserva('2030-05-20', '10:30', 'Otra consulta')).status, 409);
      const segundaReserva = await crearReserva('2030-05-20', '11:00', 'Otra consulta');
      assert.equal(segundaReserva.status, 201);
      const segundaReservaData = await segundaReserva.json();
      assert.notEqual(segundaReservaData.reserva.id, store.reservas.at(-2).id);
      assert.equal('usuario_id' in segundaReservaData.reserva, false);

    const listado = await fetch(`${base}/api/reservas`, { headers: { cookie } });
    assert.equal(listado.status, 200);
      const reservasUsuario = (await listado.json()).reservas;
      assert.equal(reservasUsuario.length, 2);
      assert.equal('usuario_id' in reservasUsuario[0], false);

    const segundoLogin = await fetch(`${base}/api/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'usuario2@reservaya.cl', password: 'Reserva456' }),
    });
    const segundaCookie = segundoLogin.headers.get('set-cookie').split(';')[0];
    const reservasSegundoUsuario = await fetch(`${base}/api/reservas`, { headers: { cookie: segundaCookie } });
    assert.deepEqual((await reservasSegundoUsuario.json()).reservas, []);
  });
});
