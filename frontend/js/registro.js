document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-registro');
  const alerta = document.getElementById('alerta');

  const nombre = document.getElementById('nombre');
  const apellido = document.getElementById('apellido');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');

  const errores = {
    nombre: document.getElementById('error-nombre'),
    apellido: document.getElementById('error-apellido'),
    email: document.getElementById('error-email'),
    password: document.getElementById('error-password'),
    confirmPassword: document.getElementById('error-confirmPassword'),
  };

  const EMAIL_REGEX = /^[^@]+@[^@]+\.[^@]+$/;

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    ocultarAlerta(alerta);
    Object.values(errores).forEach((el) => (el.textContent = ''));

    let valido = true;

    if (!nombre.value.trim()) {
      errores.nombre.textContent = 'El nombre es obligatorio.';
      valido = false;
    }

    if (!apellido.value.trim()) {
      errores.apellido.textContent = 'El apellido es obligatorio.';
      valido = false;
    }

    if (!email.value) {
      errores.email.textContent = 'El correo electrónico es obligatorio.';
      valido = false;
    } else if (!EMAIL_REGEX.test(email.value)) {
      errores.email.textContent = 'El correo electrónico no tiene un formato válido.';
      valido = false;
    }

    if (!password.value) {
      errores.password.textContent = 'La contraseña es obligatoria.';
      valido = false;
    } else if (password.value.length < 8) {
      errores.password.textContent = 'La contraseña debe tener como mínimo 8 caracteres.';
      valido = false;
    }

    if (!confirmPassword.value) {
      errores.confirmPassword.textContent = 'Debes confirmar la contraseña.';
      valido = false;
    } else if (confirmPassword.value !== password.value) {
      errores.confirmPassword.textContent = 'Las contraseñas no coinciden.';
      valido = false;
    }

    if (!valido) {
      return;
    }

    const { ok, datos } = await solicitar('/api/registro', {
      method: 'POST',
      body: JSON.stringify({
        nombre: nombre.value.trim(),
        apellido: apellido.value.trim(),
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      }),
    });

    if (!ok) {
      mostrarAlerta(alerta, datos?.error || 'No fue posible crear la cuenta.', 'error');
      return;
    }

    mostrarAlerta(alerta, datos?.message || 'Cuenta creada correctamente.', 'exito');
    form.reset();
  });
});
