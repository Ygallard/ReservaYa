# Requisitos funcionales de ReservaYa v2.2

## Alcance

ReservaYa es un sistema bajo prueba para actividades de aseguramiento de calidad. La versión incluye registro, autenticación, cierre de sesión, agendamiento y consulta de reservas. Las pantallas de reserva requieren una sesión activa.

## Requisitos funcionales

| ID | Requisito |
|---|---|
| RF-01 | Una persona puede registrarse proporcionando nombre, apellido, correo, contraseña y confirmación. |
| RF-02 | Nombre, apellido, correo y contraseña son obligatorios. |
| RF-03 | El correo debe tener formato válido y no puede estar asociado a otra cuenta, sin distinguir mayúsculas. |
| RF-04 | La contraseña debe tener como mínimo 8 caracteres. |
| RF-05 | La confirmación de contraseña debe coincidir con la contraseña. |
| RF-06 | El sistema almacena la contraseña mediante un hash y no la devuelve en respuestas. |
| RF-07 | Una persona registrada puede iniciar sesión con su correo y contraseña correctos. |
| RF-08 | El sistema rechaza credenciales incorrectas, no crea una sesión autenticada e informa que las credenciales no son válidas. |
| RF-09 | Un usuario autenticado puede cerrar sesión. |
| RF-10 | Solo un usuario autenticado puede acceder al agendamiento y a la lista de reservas. |
| RF-11 | Una reserva contiene fecha, hora y motivo obligatorios. |
| RF-12 | El sistema guarda la reserva asociada al usuario autenticado, con estado Confirmada y fecha de creación. |
| RF-13 | El usuario puede visualizar sus reservas con fecha, hora, motivo y estado. |
| RF-14 | El usuario solo puede consultar sus propias reservas. |
| RF-15 | Las reservas se muestran en orden ascendente por fecha y hora. |
| RF-16 | La fecha de una nueva reserva debe ser hoy o posterior. |
| RF-17 | Las horas disponibles son de 09:00 a 17:00, inclusive. |
| RF-18 | Un usuario no puede reservar más de una vez el mismo horario. |
| RF-19 | Las horas disponibles comienzan en intervalos de 30 minutos. |
| RF-20 | Para una reserva de hoy, la hora debe ser posterior a la hora actual. |
| RF-21 | El motivo debe contener entre 1 y 500 caracteres después de eliminar espacios externos. |
| RF-22 | La consulta muestra todas las reservas del usuario autenticado. |
| RF-23 | La fecha se presenta en formato día/mes/año. |
| RF-24 | La interfaz informa el horario de atención vigente de 09:00 a 17:00. |

## Requisitos de calidad

- RF-NF-01: Las credenciales no válidas no deben revelar si el correo está registrado.
- RF-NF-02: Los datos de reservas de un usuario no deben exponerse a otras cuentas.
- RF-NF-03: La interfaz debe ser utilizable en dispositivos de escritorio y móviles comunes.
- RF-NF-04: Las cuentas y reservas se mantienen en arrays de JavaScript durante la ejecución del servidor.
- RF-NF-05: Al reiniciar el servidor, las cuentas creadas y reservas se pierden; se vuelven a cargar las cuentas demo.
- RF-NF-06: La aplicación se ejecuta localmente con Node.js y npm, sin servicios externos.

## Interfaces bajo prueba

- `POST /api/registro`, `POST /api/login`, `POST /api/logout`, `GET /api/me`
- `POST /api/reservas`, `GET /api/reservas`
- `GET /agendar`, `GET /mis-reservas`

## Criterio de aceptación

Una prueba se considera aprobada cuando el resultado observado coincide con el requisito y no altera datos de otra cuenta. Los equipos deben registrar datos, pasos, resultado esperado/actual, estado PASS/FAIL/BLOCKED, severidad, prioridad y evidencia.
