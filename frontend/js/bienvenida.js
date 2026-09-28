async function verificarSesion() {
  const titulo = document.getElementById('titulo-bienvenida');
  const btnLogout = document.getElementById('btn-logout');
  if (!titulo || !btnLogout) return;

  const { ok, datos } = await solicitar('/api/me');

  if (!ok) {
    window.location.href = 'index.html';
    return;
  }

  titulo.textContent = `Bienvenido, ${datos.usuario.nombre}`;

  if (!btnLogout.dataset.bound) {
    btnLogout.dataset.bound = 'true';
    btnLogout.addEventListener('click', async () => {
      await solicitar('/api/logout', { method: 'POST' });
      window.location.href = 'index.html';
    });
  }
}

document.addEventListener('DOMContentLoaded', verificarSesion);
window.addEventListener('pageshow', (evento) => {
  if (evento.persisted) verificarSesion();
});
