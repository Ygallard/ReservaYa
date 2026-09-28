# ReservaYa v2.0

ReservaYa es una aplicación educativa utilizada como sistema bajo prueba para practicar testing funcional, integración, sistema, regresión, seguridad y usabilidad. Incluye registro/login y gestión básica de reservas. Node.js/Express sirve las páginas del frontend y usa PostgreSQL para persistencia.

## Inicio con Docker Compose

Requisito: Docker Desktop actualizado con Docker Compose v2.

Desde la raíz del proyecto:

```powershell
docker compose up --build
```

Servicios:

| Servicio | Dirección | Credenciales locales |
|---|---|---|
| Aplicación | http://localhost:3000 | Las cuentas de prueba indicadas abajo |
| PostgreSQL | localhost:5432 | base `reservaya`, usuario `postgres`, contraseña `reservaya_local` |
| pgAdmin | http://localhost:5050 | `admin@reservaya.local` / `ReservayaAdmin2026` |

pgAdmin ya tiene configurado el servidor `ReservaYa local`; utiliza `postgres` y la contraseña indicada para conectarte. Las credenciales por defecto son solo para un laboratorio local. Para otro entorno, definir `POSTGRES_PASSWORD`, `PGADMIN_PASSWORD` y `SESSION_SECRET` en el entorno antes de iniciar Compose.

La primera inicialización crea las tablas y carga las cuentas semilla. Los scripts de `database/` solo se ejecutan automáticamente cuando PostgreSQL crea un volumen vacío. Para eliminar el entorno local completo, incluidos los datos, usar `docker compose down -v`; no hacerlo si se desea conservar información.

## Uso

1. Abrir http://localhost:3000.
2. Iniciar sesión con una cuenta de prueba o crear una cuenta propia.
3. Desde la pantalla de bienvenida, seleccionar **Agendar hora** o **Mis reservas**.
4. Las páginas y API de reservas requieren sesión. Cada consulta de reservas se limita a la cuenta autenticada.

Rutas disponibles: `/`, `/registro.html`, `/bienvenida.html`, `/agendar` y `/mis-reservas`.

## Cuentas de prueba

| Correo | Contraseña |
|---|---|
| usuario1@reservaya.cl | Reserva123 |
| usuario2@reservaya.cl | Reserva456 |

Para pgAdmin desde el equipo anfitrión, registrar conexión con host `localhost`, puerto `5432`, base `reservaya`, usuario `postgres` y la contraseña configurada.

## Ejecución local sin Docker

Requisitos: Node.js 18+ y PostgreSQL 14+.

1. Crear una base `reservaya` y ejecutar `database/schema.sql`, luego `database/seed.sql`.
2. En `backend/`, instalar dependencias con `npm ci`.
3. Configurar las variables de conexión del backend según `backend/.env.example`.
4. Ejecutar `npm start` desde `backend/`.
5. Abrir http://localhost:3000.

## Base de datos

`database/schema.sql` es idempotente para agregar las tablas e índices requeridos sin eliminar las tablas existentes. En instalaciones existentes debe ejecutarse manualmente contra `reservaya`; Compose no vuelve a ejecutar los scripts de inicialización sobre un volumen ya creado. Las tablas son `usuarios` y `reservas`; esta última referencia `usuarios.id` mediante clave foránea.

## API

| Método | Ruta | Uso |
|---|---|---|
| POST | `/api/registro` | Crear una cuenta |
| POST | `/api/login` | Iniciar sesión |
| POST | `/api/logout` | Cerrar sesión |
| GET | `/api/me` | Consultar sesión |
| POST | `/api/reservas` | Crear una reserva (sesión requerida) |
| GET | `/api/reservas` | Consultar reservas propias (sesión requerida) |

## Documentación QA

- [Requisitos funcionales](docs/requirements.md)
- [Datos de prueba](docs/test-data.md)
- [Historial de versiones](docs/version-history.md)
- [Instrucciones anteriores](docs/REQUERIMIENTOS.md)

`docs/teacher-answer-key.md` y `docs/BUGS_DOCENTE.md` son material exclusivo del docente. No distribuirlos a estudiantes ni publicar `docs/` en un servidor web.
