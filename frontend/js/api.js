async function solicitar(ruta, opciones) {
  const respuesta = await fetch(ruta, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...opciones,
  });

  let datos = null;
  try {
    datos = await respuesta.json();
  } catch (error) {
    datos = null;
  }

  return { ok: respuesta.ok, status: respuesta.status, datos };
}

function mostrarAlerta(elemento, mensaje, tipo) {
  elemento.textContent = mensaje;
  elemento.className = `alerta visible ${tipo}`;
}

function ocultarAlerta(elemento) {
  elemento.textContent = '';
  elemento.className = 'alerta';
}
