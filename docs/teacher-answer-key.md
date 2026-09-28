# Clave docente - ReservaYa v2.0

> Uso exclusivo del equipo docente. No distribuir con el material del estudiante ni publicar en una instancia accesible desde la aplicación.

## QA-RES-01 - Se aceptan fechas pasadas

- **Funcionalidad afectada:** Agendar hora.
- **Condición para reproducirlo:** Iniciar sesión y crear una reserva con fecha anterior al día actual y hora válida.
- **Resultado esperado:** Rechazar la fecha pasada sin crear una reserva.
- **Resultado actual:** La API acepta la fecha y guarda la reserva.
- **Severidad sugerida:** Media.
- **Prioridad sugerida:** Alta.

## QA-RES-02 - Se aceptan horas fuera de atención

- **Funcionalidad afectada:** Agendar hora.
- **Condición para reproducirlo:** Crear una reserva antes de 09:00 o después de 17:00, por ejemplo 08:59 o 17:01.
- **Resultado esperado:** Rechazar horarios fuera del intervalo 09:00-17:00.
- **Resultado actual:** Se aceptan valores horarios válidos fuera del intervalo.
- **Severidad sugerida:** Media.
- **Prioridad sugerida:** Media.

## QA-RES-03 - Se permite duplicar horario

- **Funcionalidad afectada:** Agendar hora.
- **Condición para reproducirlo:** Con una misma cuenta, enviar dos reservas con idénticas fecha y hora.
- **Resultado esperado:** Rechazar la segunda reserva para ese usuario y horario.
- **Resultado actual:** Se almacenan ambas reservas.
- **Severidad sugerida:** Alta.
- **Prioridad sugerida:** Alta.

## QA-RES-04 - Motivo vacío aceptado

- **Funcionalidad afectada:** Validación de reserva.
- **Condición para reproducirlo:** Enviar fecha y hora válidas dejando el motivo vacío.
- **Resultado esperado:** Solicitar un motivo antes de confirmar.
- **Resultado actual:** Se crea la reserva con motivo vacío.
- **Severidad sugerida:** Media.
- **Prioridad sugerida:** Media.

## QA-RES-05 - Listado en orden descendente

- **Funcionalidad afectada:** Mis reservas.
- **Condición para reproducirlo:** Crear al menos dos reservas en fechas/horas distintas y consultar la lista.
- **Resultado esperado:** Orden ascendente por fecha y hora, según RF-15.
- **Resultado actual:** El endpoint entrega los resultados en orden descendente.
- **Severidad sugerida:** Baja.
- **Prioridad sugerida:** Media.

## QA-RES-06 - Estado inicial no coincide con confirmación

- **Funcionalidad afectada:** Confirmación y visualización de reserva.
- **Condición para reproducirlo:** Crear una reserva mediante la acción "Confirmar reserva" y revisar el estado en Mis reservas o PostgreSQL.
- **Resultado esperado:** El estado debe mostrarse como `Confirmada`.
- **Resultado actual:** La reserva queda como `Pendiente` por el valor predeterminado de la tabla.
- **Severidad sugerida:** Media.
- **Prioridad sugerida:** Alta.

## Alcance de aislamiento

La API siempre filtra por el identificador de usuario de la sesión; no se incluye exposición intencional de datos entre cuentas. No distribuir esta clave en el contenedor de aplicación ni enlazarla desde rutas públicas.
