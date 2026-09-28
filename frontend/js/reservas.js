document.addEventListener('DOMContentLoaded', async () => {
  const { ok } = await solicitar('/api/me');
  if (!ok) {
    window.location.href = '/index.html';
    return;
  }

  const form = document.getElementById('form-reserva');
  const alerta = document.getElementById('alerta');
  const fecha = document.getElementById('fecha');
  const hora = document.getElementById('hora');
  const motivo = document.getElementById('motivo');
  const boton = document.getElementById('btn-reservar');

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    ocultarAlerta(alerta);
    let valido = true;
    document.getElementById('error-fecha').textContent = '';
    document.getElementById('error-hora').textContent = '';

    if (!fecha.value) {
      document.getElementById('error-fecha').textContent = 'La fecha es obligatoria.';
      valido = false;
    }
    if (!hora.value) {
      document.getElementById('error-hora').textContent = 'La hora es obligatoria.';
      valido = false;
    }
    if (!valido) return;

    boton.disabled = true;
    boton.textContent = 'Guardando...';
    try {
      const { ok: creada, datos } = await solicitar('/api/reservas', {
        method: 'POST',
        body: JSON.stringify({ fecha: fecha.value, hora: hora.value, motivo: motivo.value }),
      });
      if (!creada) {
        mostrarAlerta(alerta, datos?.error || 'No fue posible guardar la reserva.', 'error');
        return;
      }
      mostrarAlerta(alerta, datos?.message || 'Reserva confirmada correctamente.', 'exito');
      form.reset();
    } catch (error) {
      mostrarAlerta(alerta, 'No fue posible conectar con el servidor.', 'error');
    } finally {
      boton.disabled = false;
      boton.textContent = 'Confirmar reserva';
    }
  });
});
