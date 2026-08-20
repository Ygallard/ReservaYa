document.addEventListener('DOMContentLoaded', async () => {
  const titulo = document.getElementById('titulo-bienvenida');
  const btnLogout = document.getElementById('btn-logout');

  const { ok, datos } = await solicitar('/api/me');

  if (!ok) {
    window.location.href = 'index.html';
    return;
  }

  titulo.textContent = `Bienvenido, ${datos.usuario.nombre}`;

  btnLogout.addEventListener('click', async () => {
    await solicitar('/api/logout', { method: 'POST' });
    window.location.href = 'index.html';
  });
});
