-- Esquema de base de datos para RESERVAYA
-- Ejecutar en la base de datos "reservaya" usando pgAdmin 4 o psql

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM usuarios
        GROUP BY LOWER(BTRIM(email))
        HAVING COUNT(*) > 1
    ) THEN
        CREATE UNIQUE INDEX IF NOT EXISTS usuarios_email_normalizado_unique
            ON usuarios (LOWER(BTRIM(email)));
    ELSE
        RAISE NOTICE 'Se conserva el índice de correo exacto: hay cuentas heredadas que requieren revisión manual.';
    END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    motivo TEXT NOT NULL DEFAULT '',
    estado VARCHAR(20) NOT NULL DEFAULT 'Confirmada',
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT reservas_estado_valido CHECK (estado IN ('Pendiente', 'Confirmada', 'Cancelada'))
);

ALTER TABLE reservas ALTER COLUMN estado SET DEFAULT 'Confirmada';

CREATE INDEX IF NOT EXISTS reservas_usuario_fecha_hora_idx
    ON reservas (usuario_id, fecha, hora);

CREATE UNIQUE INDEX IF NOT EXISTS reservas_usuario_fecha_hora_unique
    ON reservas (usuario_id, fecha, hora);
