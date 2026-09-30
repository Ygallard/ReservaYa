function crearFilaReserva(reserva) {
  const fila = document.createElement('tr');
  const fecha = new Date(reserva.fecha).toLocaleDateString('es-CL');
  [fecha, String(reserva.hora).slice(0, 5), reserva.motivo, reserva.estado].forEach((valor) => {
    const celda = document.createElement('td');
    celda.textContent = valor || '—';
    fila.appendChild(celda);
  });
  return fila;
}

document.addEventListener('DOMContentLoaded', async () => {
  const { ok: sesionActiva } = await solicitar('/api/me');
  if (!sesionActiva) {
    window.location.href = '/index.html';
    return;
  }

  const alerta = document.getElementById('alerta');
  const lista = document.getElementById('lista-reservas');
  try {
    const { ok, datos } = await solicitar('/api/reservas');
    if (!ok) {
      mostrarAlerta(alerta, datos?.error || 'No fue posible cargar las reservas.', 'error');
      return;
    }
    const reservas = datos?.reservas || [];
    if (reservas.length === 0) {
      lista.textContent = 'Todavía no tienes reservas.';
      return;
    }

    const tabla = document.createElement('table');
    tabla.className = 'tabla-reservas';
    const encabezado = document.createElement('thead');
    const filaEncabezado = document.createElement('tr');
    ['Fecha', 'Hora', 'Motivo', 'Estado'].forEach((texto) => {
      const celda = document.createElement('th');
      celda.scope = 'col';
      celda.textContent = texto;
      filaEncabezado.appendChild(celda);
    });
    encabezado.appendChild(filaEncabezado);
    const cuerpo = document.createElement('tbody');
    reservas.forEach((reserva) => cuerpo.appendChild(crearFilaReserva(reserva)));
    tabla.append(encabezado, cuerpo);
    lista.replaceChildren(tabla);
  } catch (error) {
    mostrarAlerta(alerta, 'No fue posible conectar con el servidor.', 'error');
  }
});
