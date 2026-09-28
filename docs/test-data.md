# Datos de prueba

## Cuentas semilla

La inicialización de PostgreSQL crea estas cuentas de laboratorio:

| Correo | Contraseña | Nombre |
|---|---|---|
| usuario1@reservaya.cl | Reserva123 | Ana Torres |
| usuario2@reservaya.cl | Reserva456 | Bruno Salinas |

Las contraseñas se guardan como hashes bcrypt en la base de datos. No reutilizar estas credenciales fuera del entorno local educativo.

## Datos sugeridos para pruebas

| Caso | Datos |
|---|---|
| Registro válido | nombre `Camila`, apellido `QA`, correo único `camila.qa@example.test`, contraseña y confirmación `Abcd1234` |
| Límite mínimo | Contraseña de 8 caracteres: `Abcd1234` |
| Debajo del mínimo | Contraseña de 7 caracteres: `Abcd123` |
| Correo mal formado | `correo-invalido` |
| Correo duplicado | `USUARIO1@RESERVAYA.CL` |
| Confirmación distinta | `Abcd1234` / `Abcd1235` |
| Reserva válida | Fecha futura, hora `10:30`, motivo `Consulta general` |
| Reserva sin motivo | Fecha futura, hora `11:00`, motivo vacío |
| Reserva repetida | Repetir misma fecha y hora con la misma cuenta |
| Límites horarios | `08:59`, `09:00`, `17:00`, `17:01` |
| Fecha pasada | Una fecha anterior a hoy |

Cada estudiante debe inventar y anotar correos únicos para evitar colisiones entre equipos. Para probar aislamiento, utilizar dos cuentas y crear reservas distintas para cada una.

## PASS / FAIL / BLOCKED

- **PASS:** resultado observado cumple el requisito.
- **FAIL:** resultado observado difiere del esperado; adjuntar pasos y evidencia.
- **BLOCKED:** no fue posible ejecutar el caso por una dependencia, dato o entorno indisponible; indicar el bloqueo.
