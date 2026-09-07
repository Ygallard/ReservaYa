# RESERVAYA

Proyecto práctico compuesto por dos módulos: **Registro de usuario** e **Inicio de sesión**.
Backend en Node.js/Express, frontend en HTML/CSS/JavaScript y base de datos PostgreSQL.

## Requisitos previos

- Node.js 18 o superior.
- PostgreSQL instalado localmente.
- pgAdmin 4.

## 1. Instalar PostgreSQL

Descarga e instala PostgreSQL desde [postgresql.org](https://www.postgresql.org/download/) y
recuerda la contraseña que asignes al usuario `postgres`. pgAdmin 4 normalmente se instala junto
con PostgreSQL.

## 2. Crear la base de datos

1. Abre **pgAdmin 4** y conéctate a tu servidor local de PostgreSQL.
2. Haz clic derecho sobre **Databases** → **Create** → **Database...**.
3. Asigna el nombre `reservaya` y guarda.

## 3. Abrir pgAdmin y el Query Tool

1. Selecciona la base de datos `reservaya` en el árbol de pgAdmin.
2. Haz clic en **Query Tool** (icono de rayo o menú Tools → Query Tool).

## 4. Ejecutar schema.sql

1. Abre el archivo [database/schema.sql](database/schema.sql) con el editor de texto de tu
   preferencia, copia su contenido y pégalo en el Query Tool de pgAdmin (o usa **Open File** en el
   Query Tool para cargarlo directamente).
2. Ejecuta el script (botón ▶ o F5). Esto crea la tabla `usuarios`.

## 5. Ejecutar seed.sql

1. De la misma forma, abre y ejecuta [database/seed.sql](database/seed.sql) en el Query Tool.
2. Esto inserta dos usuarios de prueba (ver credenciales en `docs/REQUERIMIENTOS.md`).

## 6. Configurar el archivo .env

1. Ve a la carpeta `backend/`.
2. Copia el archivo `.env.example` y renombra la copia a `.env`.
3. Edita `.env` con los datos de tu instalación local de PostgreSQL (usuario, contraseña, puerto, etc.).

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reservaya
DB_USER=postgres
DB_PASSWORD=tu_password
PORT=3000
SESSION_SECRET=una_frase_secreta
```

## 7. Ejecutar el backend

Desde la carpeta `backend/`:

```powershell
cd backend
npm install
npm start
```

El servidor quedará escuchando en `http://localhost:3000` (o el puerto configurado en `.env`).

## 8. Abrir el frontend

El backend sirve directamente los archivos del frontend. Simplemente abre en tu navegador:

```
http://localhost:3000
```

Esto carga la pantalla de inicio de sesión. Desde ahí puedes navegar a "Crear cuenta" para
registrar un nuevo usuario.

## Ejecutar con Docker

Requisitos: Docker Desktop instalado y en ejecución.

Desde la raíz del proyecto:

```powershell
docker compose up --build
```

Esto inicia el backend en `http://localhost:3000` y una instancia de PostgreSQL. La base de datos
se crea automáticamente con `database/schema.sql` y `database/seed.sql` en el primer arranque.
Los datos quedan guardados en el volumen `postgres_data`.

Para detener los contenedores:

```powershell
docker compose down
```

Para eliminar también los datos de prueba y reinicializar PostgreSQL:

```powershell
docker compose down -v
```

En un entorno de hosting, configura las variables `DB_NAME`, `DB_USER`, `DB_PASSWORD` y
`SESSION_SECRET` como variables del servicio. Si el proveedor asigna otro puerto público, usa
`APP_PORT` para el mapeo local de Docker.

## Estructura del proyecto

```
ReservaYa/
├── backend/            Servidor Express, rutas de la API y conexión a PostgreSQL
├── frontend/            Páginas HTML, CSS y JavaScript del cliente
├── database/            Scripts SQL: schema.sql y seed.sql
├── docs/
│   └── REQUERIMIENTOS.md   Documento de requerimientos para el equipo de QA
└── README.md
```

## API disponible

| Método | Ruta            | Descripción                          |
|--------|-----------------|---------------------------------------|
| POST   | `/api/registro` | Crea una nueva cuenta de usuario.     |
| POST   | `/api/login`    | Inicia sesión con correo y contraseña. |
| POST   | `/api/logout`   | Cierra la sesión activa.              |
| GET    | `/api/me`       | Consulta si hay una sesión activa.    |

## Documentación

El documento [docs/REQUERIMIENTOS.md](docs/REQUERIMIENTOS.md) contiene el alcance y los
requerimientos funcionales entregados al equipo de QA para el análisis, diseño y ejecución de
sus pruebas.
