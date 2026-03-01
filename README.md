# Sistema-Bancario-la-33
Proyecto a nivel escolar del grupo "la 33" del Centro Tecnico Laboral Kinal de la seccion IN6AV 

## Descripcion
- Sistema bancario desarrollado con arquitectura de microservicios que permite la gestión de usuarios, cuentas, productos financieros y operaciones bancarias de manera segura.

## Requisitos Previos
- Node.js 
- PostgreSQL
- MongoDB


## Funcionalidades Principales
- Registro y autenticación de usuarios con JWT
- Recuperación y restablecimiento de contraseñas
- Sistema de roles y permisos
- Envío de correos electrónicos (SMTP)
- Rate limiting y protección de endpoints
- Middleware de manejo global de errores

## Tecnologías Utilizadas
- Node.js
- Express
- PostgreSQL
- JWT
- Cloudinary
- Nodemailer
- dotenv

## Configuración

1. Clona el repositorio:
   git clone <url-del-repositorio>

2. Navega a la carpeta del proyecto:
   cd auth-node

3. Instala las dependencias:
   npm install

4. Inicia el servidor:
   npm start


## Notas 
- Este servicio está pensado para ser usado como respaldo ante caídas del AuthService principal.
- Mantén sincronizadas las variables de entorno críticas (DB, JWT, Cloudinary, SMTP) con el servicio principal.
- Para pruebas locales, asegúrate de tener una base de datos PostgreSQL y credenciales válidas.

- Desarrollado por el Grupo No. 33.

## Roles y Permisos
- USER: Usuario estándar (default al registrarse)
- ADMIN: Administrador del sistema
- MODERATOR: Moderador de contenido

## Notas de desarrollo 
- El servidor escucha en el puerto definido en .env (default: 3021)
- Las rutas están prefijadas con /api
- Los tokens JWT expiran según configuración en .env
- Los emails de verificación y reset de contraseña son válidos por 24 horas
- Rate limiting configurado: 100 requests por 15 minutos por IP

## Autor
- Grupo la 33

## Microservicios
- Servicio de autenticacion
- Servicio Bancario
- Servicio de productos y divisas
- Servicio de notificaciones
- Servicio de reportes

## Base de datos
- PostgreSQL
- MongoDB

## Estructura del proyecto
- controllers/
- routes/
- middlewares/
- models/
- config/

## Licencia+
- Este proyecto está bajo la Licencia MIT.

