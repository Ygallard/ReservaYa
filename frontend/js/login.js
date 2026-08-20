document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-login');
  const alerta = document.getElementById('alerta');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const errorEmail = document.getElementById('error-email');
  const errorPassword = document.getElementById('error-password');
  const btn = document.getElementById('btn-login');

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    ocultarAlerta(alerta);
    errorEmail.textContent = '';
    errorPassword.textContent = '';

    let valido = true;

    if (!email.value.trim()) {
      errorEmail.textContent = 'El correo electrónico es obligatorio.';
      valido = false;
    }

    if (!password.value) {
      errorPassword.textContent = 'La contraseña es obligatoria.';
      valido = false;
    }

    if (!valido) {
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Ingresando...';

    const { ok, datos } = await solicitar('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    btn.disabled = false;
    btn.textContent = 'Iniciar sesión';

    if (!ok) {
      mostrarAlerta(alerta, datos?.error || 'No fue posible iniciar sesión.', 'error');
      return;
    }

    window.location.href = 'bienvenida.html';
  });
});
