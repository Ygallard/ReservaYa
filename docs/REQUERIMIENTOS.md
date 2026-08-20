# RESERVAYA — Requerimientos del Sistema

## 1. Objetivo del sistema

RESERVAYA es una aplicación web que permitirá, en el futuro, la gestión de reservas en línea.
Esta primera versión entrega únicamente la base de gestión de cuentas de usuario, necesaria
para que una persona pueda crear una cuenta e iniciar sesión en el sistema.

## 2. Alcance de esta versión

Esta versión incluye exclusivamente dos módulos:

- Módulo 1: Registro de usuario.
- Módulo 2: Inicio de sesión.

No se incluyen en esta versión: gestión de reservas, pagos, ni panel de administración.

## 3. Descripción de los módulos

### 3.1 Registro de usuario

Pantalla que permite a una persona crear una cuenta en RESERVAYA. Solicita nombre, apellido,
correo electrónico, contraseña y confirmación de contraseña. Incluye el botón **"Crear cuenta"**
y un enlace hacia la pantalla de inicio de sesión.

### 3.2 Inicio de sesión

Pantalla que permite a una persona con una cuenta existente autenticarse en RESERVAYA. Solicita
correo electrónico y contraseña. Incluye el botón **"Iniciar sesión"** y un enlace hacia la
pantalla de registro. Un usuario autenticado puede cerrar sesión desde la pantalla que se
muestra después de iniciar sesión.

## 4. Requerimientos funcionales

### Registro de usuario

| ID | Requerimiento |
|----|----------------|
| REQ-REG-001 | El nombre del usuario es obligatorio. |
| REQ-REG-002 | El apellido del usuario es obligatorio. |
| REQ-REG-003 | El correo electrónico es obligatorio. |
| REQ-REG-004 | El correo electrónico debe tener un formato válido. |
| REQ-REG-005 | No se puede registrar un correo electrónico que ya exista. |
| REQ-REG-006 | La contraseña es obligatoria. |
| REQ-REG-007 | La contraseña debe tener como mínimo 8 caracteres. |
| REQ-REG-008 | La confirmación de contraseña debe coincidir con la contraseña. |
| REQ-REG-009 | Cuando los datos son válidos, el sistema debe registrar al usuario. |
| REQ-REG-010 | Después del registro exitoso, el sistema debe informar al usuario. |

### Inicio de sesión

| ID | Requerimiento |
|----|----------------|
| REQ-LOGIN-001 | El correo electrónico es obligatorio. |
| REQ-LOGIN-002 | La contraseña es obligatoria. |
| REQ-LOGIN-003 | El sistema debe permitir iniciar sesión con credenciales válidas. |
| REQ-LOGIN-004 | El sistema debe rechazar credenciales incorrectas. |
| REQ-LOGIN-005 | El sistema debe informar al usuario cuando las credenciales no sean válidas. |
| REQ-LOGIN-006 | Un usuario autenticado debe poder cerrar sesión. |

## 5. Reglas de negocio conocidas

- Cada correo electrónico debe estar asociado a una única cuenta.
- Las contraseñas se almacenan de forma protegida (hash) y no se guardan en texto plano.
- El acceso a las funcionalidades de la aplicación requiere una sesión iniciada.

## 6. Datos de acceso

La aplicación se ejecuta de forma local. La URL del frontend y del backend será entregada por
el equipo de desarrollo al momento de la instalación (ver README.md del proyecto).

## 7. Usuarios de prueba

El sistema incluye los siguientes usuarios previamente registrados en la base de datos:

| Correo electrónico | Contraseña |
|---------------------|------------|
| usuario1@reservaya.cl | Reserva123 |
| usuario2@reservaya.cl | Reserva456 |

El equipo de QA también puede registrar sus propias cuentas utilizando la pantalla de registro.

## 8. Estructura de la base de datos

La aplicación utiliza una base de datos PostgreSQL llamada `reservaya`, con una única tabla:

### Tabla `usuarios`

| Campo | Tipo | Restricciones |
|-------|------|----------------|
| id | SERIAL | Llave primaria |
| nombre | VARCHAR(100) | Obligatorio |
| apellido | VARCHAR(100) | Obligatorio |
| email | VARCHAR(150) | Obligatorio, único |
| password | VARCHAR(255) | Obligatorio (almacenada como hash) |
| created_at | TIMESTAMP | Se genera automáticamente al crear el registro |

Esta información puede ser consultada directamente en pgAdmin 4, y es útil como referencia para
verificar el resultado de las pruebas realizadas sobre el registro de usuarios.
