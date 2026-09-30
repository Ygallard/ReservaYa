# ReservaYa v2.1

ReservaYa es un sistema bajo prueba para el módulo **Taller de Testing y Calidad de Software**. El estudiantado utiliza la aplicación y documenta sus pruebas; no desarrolla el producto. Incluye registro, inicio de sesión, agendamiento y consulta de reservas con persistencia en PostgreSQL.

## Requisitos previos

- **Node.js 20 LTS o superior:** instalar desde [nodejs.org](https://nodejs.org/). El instalador de Windows incluye npm.
- **npm:** se instala junto con Node.js. Comprobar ambos desde una terminal nueva:

	```powershell
	node --version
	npm --version
	```

- **PostgreSQL 14 o superior:** instalar desde [postgresql.org/download](https://www.postgresql.org/download/). En Windows, el instalador oficial permite instalar PostgreSQL y pgAdmin 4.
- **pgAdmin 4:** instalar desde [pgadmin.org/download](https://www.pgadmin.org/download/) si no se seleccionó durante la instalación de PostgreSQL.
- **Navegador web** actualizado.

Durante la instalación de PostgreSQL, anotar la contraseña local asignada al usuario `postgres` y dejar el puerto predeterminado `5432`, salvo que ya esté ocupado. Mantener en ejecución el servicio PostgreSQL. pgAdmin es la herramienta gráfica para conectarse al servidor; no reemplaza al servicio.

## Crear la base de datos

1. Abrir pgAdmin 4 y conectarse al servidor local PostgreSQL. Ingresar la contraseña del usuario `postgres` configurada durante la instalación. Si no aparece un servidor, elegir **Register > Server**; en **Connection** usar host `localhost`, puerto `5432`, usuario `postgres` y esa misma contraseña.
2. En el árbol del servidor, hacer clic derecho en **Databases > Create > Database**. Usar el nombre `reservaya` y guardar. Para crearla con Query Tool también se puede ejecutar `CREATE DATABASE reservaya;` conectado a otra base, como `postgres`.
3. Seleccionar la base `reservaya`, abrir **Tools > Query Tool**, abrir `database/schema.sql` y ejecutar el archivo completo. Esto crea las tablas e índices.
4. En el mismo Query Tool, abrir y ejecutar `database/seed.sql` para cargar dos cuentas sintéticas de prueba. El script se puede volver a ejecutar sin duplicar estas cuentas.
5. Actualizar el árbol de pgAdmin y expandir **reservaya > Schemas > public > Tables**. Deben aparecer `usuarios` y `reservas`. Para inspeccionar filas, usar **View/Edit Data > All Rows** o ejecutar `SELECT * FROM usuarios;` y `SELECT * FROM reservas;`.

Si se usa `psql` en vez de pgAdmin, conectar a `reservaya` y ejecutar los archivos `database/schema.sql` y `database/seed.sql` en ese orden. En PowerShell:

```powershell
psql -U postgres -d reservaya -f database/schema.sql
psql -U postgres -d reservaya -f database/seed.sql
```

## Configurar e instalar

Desde la carpeta raíz del proyecto, crear el archivo local `.env` a partir del ejemplo:

```powershell
Copy-Item .env.example .env
```

Editar `.env` y reemplazar `DB_PASSWORD` por la contraseña local de PostgreSQL. Las variables disponibles son:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reservaya
DB_USER=postgres
DB_PASSWORD=la_clave_configurada_localmente
PORT=3000
SESSION_SECRET=un_secreto_local
```

No compartir ni subir `.env`; está excluido del control de versiones. `.env.example` contiene solo valores ilustrativos. Instalar las dependencias desde la raíz:

```powershell
npm install
```

## Ejecutar la aplicación

Para el trabajo habitual, desde la raíz ejecutar:

```powershell
npm run dev
```

Este es el comando recomendado durante las pruebas; reinicia el servidor al detectar cambios en archivos del backend. Para iniciar sin modo de observación:

```powershell
npm start
```

Ambos comandos usan el puerto indicado en `PORT` (por defecto, `3000`). Abrir [http://localhost:3000](http://localhost:3000/) en el navegador. Para detener el servidor, volver a la terminal y pulsar `Ctrl+C`.

Si aparece un error de conexión a PostgreSQL, confirmar que el servicio está iniciado, que existe la base `reservaya` y que los valores `DB_*` de `.env` coinciden con la configuración local.

## Uso del sistema

Ingresar con una cuenta de prueba o crear una cuenta desde **Crear cuenta**. Después de iniciar sesión se puede elegir **Agendar hora** o **Mis reservas**. Las reservas requieren sesión y pertenecen a la cuenta autenticada.

| Correo de prueba | Contraseña de prueba |
|---|---|
| usuario1@reservaya.cl | Reserva123 |
| usuario2@reservaya.cl | Reserva456 |

## Rutas de la API

| Método | Ruta | Uso |
|---|---|---|
| `POST` | `/api/registro` | Crear una cuenta |
| `POST` | `/api/login` | Iniciar sesión |
| `POST` | `/api/logout` | Cerrar sesión |
| `GET` | `/api/me` | Consultar la sesión activa |
| `POST` | `/api/reservas` | Crear una reserva (requiere sesión) |
| `GET` | `/api/reservas` | Consultar reservas propias (requiere sesión) |

## Documentación para QA

- [Requisitos funcionales](docs/requirements.md)
- [Datos sintéticos de prueba](docs/test-data.md)
- [Historial de versiones](docs/version-history.md)

La clave de respuestas es material exclusivo del equipo docente y no debe incluirse en los archivos entregados al estudiantado.
