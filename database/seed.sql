-- Datos iniciales para RESERVAYA
-- Ejecutar despues de schema.sql

-- Contraseña de usuario1@reservaya.cl: Reserva123
-- Contraseña de usuario2@reservaya.cl: Reserva456

INSERT INTO usuarios (nombre, apellido, email, password)
VALUES
    ('Ana', 'Torres', 'usuario1@reservaya.cl', '$2a$10$SbVPHm9aCyszc047cnE7OuESZoF3XGzZSoHyON8OLy5.l/6TOHYVW'),
    ('Bruno', 'Salinas', 'usuario2@reservaya.cl', '$2a$10$fl9zLoRQWV5978KAwCENNeNyovo.stKOfkCz.8gAoZVsGSmRb05Ye')
ON CONFLICT (email) DO NOTHING;
