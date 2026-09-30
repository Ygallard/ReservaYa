# ReservaYa v2.2

ReservaYa es una aplicación web para el módulo **Taller de Testing y Calidad de Software**. El estudiantado utiliza el sistema para diseñar y ejecutar pruebas; no necesita configurar servicios adicionales.

## Requisitos

- Node.js 20 LTS o superior, con npm incluido. Descarga: [nodejs.org](https://nodejs.org/).
- Un navegador web actualizado.

Comprueba la instalación en una terminal:

```powershell
node --version
npm --version
```

## Instalar y ejecutar

Desde la carpeta raíz del proyecto, ejecutar:

```powershell
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000/) en el navegador. El servidor reinicia el backend cuando detecta cambios. Para detenerlo, pulsar `Ctrl+C` en esa terminal. También está disponible `npm start` para iniciar sin reinicio automático.

## Uso

Se puede iniciar sesión con cualquiera de estas cuentas demo o crear una cuenta desde **Crear cuenta**:

| Correo | Contraseña |
|---|---|
| usuario1@reservaya.cl | Reserva123 |
| usuario2@reservaya.cl | Reserva456 |

Después de iniciar sesión, seleccionar **Agendar hora**, completar fecha, hora y motivo, y confirmar. La opción **Mis reservas** muestra las reservas asociadas a la cuenta actual. Para probar aislamiento, usar dos cuentas distintas.

## Datos durante la ejecución

Las cuentas registradas y reservas nuevas se guardan en arrays de JavaScript en memoria mientras el proceso Node.js siga ejecutándose. Al detener o reiniciar el servidor, esos datos se pierden. Al iniciar de nuevo solo se cargan las dos cuentas demo; las cuentas creadas por estudiantes y todas las reservas anteriores ya no estarán disponibles.

## Pruebas

Ejecutar la suite automatizada desde la raíz:

```powershell
npm test
```

La API mantiene las rutas `POST /api/registro`, `POST /api/login`, `POST /api/logout`, `GET /api/me`, `POST /api/reservas` y `GET /api/reservas`.

## Documentación QA

- [Requisitos funcionales](docs/requirements.md)
- [Datos de prueba](docs/test-data.md)
- [Historial de versiones](docs/version-history.md)

La clave docente no forma parte de la documentación entregada al estudiantado.
