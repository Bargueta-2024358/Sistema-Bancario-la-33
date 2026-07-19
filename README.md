# Sistema Bancario La 33

Proyecto académico del grupo **La 33 ** basado en arquitectura de microservicios.

## 1) Arquitectura general

El sistema está dividido en estos servicios:

- `authentication-service/auth-service`  
  ASP.NET Core + Entity Framework + PostgreSQL.  
  Maneja autenticación, autorización, perfil, recuperación de contraseña y gestión de usuarios.

- `products-service`  
  Node.js + Express + MongoDB.  
  Maneja productos, monedas, tipos de cuenta y tasas de cambio.

- `banking-service`  
  Node.js + Express + MongoDB.  
  Maneja cuentas, depósitos, retiros, transferencias e historial de movimientos.

- `notifications-service`  
  Node.js + Express + MongoDB.  
  Maneja notificaciones de usuario y eventos internos entre microservicios.

- `report-service`  
  Node.js + Express + PostgreSQL.  
  Maneja historial consolidado, estados de cuenta y reportes/exportaciones.

- `client-admin`  
  React + Vite.  
  Frontend administrativo y cliente.

## 2) Funcionalidades implementadas

- Login con JWT y control por roles (`ADMIN`, `CLIENT`/`USER_ROLE`).
- Gestión administrativa de usuarios (crear, editar, eliminar, cambio de rol).
- Perfil editable con imagen (Cloudinary).
- Recuperación de contraseña y verificación de correo.
- Gestión de:
  - Productos
  - Monedas
  - Tipos de cuenta
  - Tasas de cambio
- Operaciones bancarias:
  - Creación y desactivación de cuentas
  - Depósitos y retiros
  - Transferencias (incluye descripción y tipo de cuenta en movimiento)
  - Reversión de movimientos (ventana de tiempo)
- Notificaciones:
  - Transferencias
  - Depósitos
  - Notificaciones internas y de correo
- Reportes:
  - Historial por usuario
  - Estado de cuenta
  - Reportes globales y estadísticas

## 3) Requisitos

- Node.js 18+ (recomendado 20+)
- pnpm (o npm)
- .NET SDK 8
- MongoDB
- PostgreSQL

## 4) Variables de entorno y configuración

Cada servicio incluye un archivo de ejemplo. Copia y ajusta antes de arrancar:

- Node/React: `cp .env.example .env` en cada carpeta del servicio
- Auth (.NET): usa `appsettings.example.json` como referencia para `appsettings.json`

**Importante:** `node_modules`, `bin/`, `obj/` y `.env` no se versionan. Tras clonar el repo debes instalar dependencias en cada servicio.

### Claves mínimas a revisar

- JWT: `JWT_SECRET` / `JwtSettings:SecretKey`, `ISSUER`, `AUDIENCE` (iguales en todos)
- `INTERNAL_SERVICE_KEY` (igual en banking, notifications, report y Auth)
- Conexión a base de datos (Mongo/PostgreSQL)
- URL de servicios internos (`report`, `notifications`, `products`)
- SMTP (notifications/auth)
- Cloudinary (auth)


## 5) Cómo arrancar cada parte

Desde la raíz del proyecto:

### 5.1 Auth Service (.NET)

```bash
cd authentication-service/auth-service
dotnet restore
dotnet run --project src/AuthService.Api/AuthService.Api.csproj
```

- Base URL esperada: `http://localhost:5210`
- Swagger: `http://localhost:5210/swagger`

### 5.2 Products Service

```bash
cd products-service
cp .env.example .env
pnpm install
pnpm run dev
```

- Puerto esperado: `3001`
- Base API: `http://localhost:3001/BancoLa33/v1`
- Swagger: `http://localhost:3001/api-docs`

### 5.3 Banking Service

```bash
cd banking-service
cp .env.example .env
pnpm install
pnpm run dev
```

- Puerto esperado: `3024`
- Base API: `http://localhost:3024/api/accounts`
- Swagger: `http://localhost:3024/api-docs`

### 5.4 Notifications Service

```bash
cd notifications-service
cp .env.example .env
pnpm install
pnpm run dev
```

- Puerto esperado: `3023`
- Base API: `http://localhost:3023/api`
- Swagger: `http://localhost:3023/api-docs`

### 5.5 Report Service

```bash
cd report-service
cp .env.example .env
pnpm install
pnpm run dev
```

- Puerto esperado: `3022`
- Base API: `http://localhost:3022/api`
- Swagger: `http://localhost:3022/api-docs`

### 5.6 Frontend (`client-admin`)

```bash
cd client-admin
cp .env.example .env
pnpm install
pnpm run dev
```

- Puerto esperado: `5174`
- URL: `http://localhost:5174`

## 6) Frontend: rutas principales

- `/` landing principal
- `/auth` autenticación
- `/verify-email?token=...` verificación por enlace
- `/reset-password?token=...` restablecimiento de contraseña
- `/admin/*` vistas administrativas
- `/client/*` vistas cliente

## 7) Endpoints por servicio

## Auth Service (`/api/v1`)

### `AuthController` (`/api/v1/Auth`)

- `GET /profile`
- `PUT /profile`
- `PUT /profile/picture`
- `POST /profile/by-id`
- `POST /register` (actualmente bloqueado según reglas del proyecto)
- `POST /login`
- `POST /verify-email`
- `POST /resend-verification`
- `POST /forgot-password`
- `POST /reset-password`

### `UsersController` (`/api/v1/Users`)

- `GET /`
- `GET /{id}`
- `POST /`
- `PUT /{id}`
- `PUT /{id}/role`
- `DELETE /{id}`

### Health

- `GET /health`
- `GET /api/v1/health`

## Products Service (`/BancoLa33/v1`)

### Account Types (`/accountTypes`)

- `GET /`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `PUT /:id/activate`
- `PUT /:id/deactivate`

### Currencies (`/currencies`)

- `GET /`
- `GET /external-rates`
- `GET /convert`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `PUT /:id/activate`
- `PUT /:id/deactivate`

### Exchange Rates (`/exchangeRates`)

- `GET /`
- `GET /convert`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `PUT /:id/activate`
- `PUT /:id/deactivate`

### Products (`/products`)

- `GET /`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `PUT /:id/activate`
- `PUT /:id/deactivate`

## Banking Service (`/api/accounts`)

- `GET /my`
- `GET /top-movements`
- `GET /user/:userId/balance`
- `POST /transactions/:transactionId/revert`
- `POST /deposits/:transactionId/revert` (compatibilidad)
- `GET /` (admin)
- `POST /` (admin)
- `PATCH /:accountNumber/deactivate`
- `POST /:accountNumber/admin-deposit`
- `GET /:accountNumber/last-movements`
- `POST /:accountNumber/transfer`
- `POST /:accountNumber/deposit`
- `POST /:accountNumber/withdraw`
- `GET /:accountNumber/balance`
- `GET /:accountNumber/transactions`

## Notifications Service (`/api`)

### User notifications (`/notifications`)

- `GET /`
- `GET /unread/count`
- `GET /:id`
- `PATCH /:id/read`

### Internal events (`/events`)

- `POST /transfer`
- `POST /deposit`
- `POST /password-changed`
- `POST /password-reset-requested`
- `POST /alert`
- `POST /confirmation`
- `POST /email`

## Report Service (`/api`)

### Transactions

- `POST /transactions` (uso interno)

### Reports (`/reports`)

- `GET /history/:userId`
- `GET /history/:userId/export`
- `GET /account-statement/:accountNumber`
- `GET /account-statement/:accountNumber/export`
- `GET /financial/:userId`
- `GET /statistics/:userId`
- `GET /global` (admin)
- `GET /user/:userId`

## 8) Flujo recomendado de inicio local

1. Levantar PostgreSQL y MongoDB.
2. Iniciar `authentication-service`.
3. Iniciar `products-service`.
4. Iniciar `notifications-service`.
5. Iniciar `report-service`.
6. Iniciar `banking-service`.
7. Iniciar `client-admin`.

Si hay errores de autenticación entre servicios, validar:

- `JWT_SECRET`, `JWT_ISSUER`, `JWT_AUDIENCE` iguales en servicios Node y Auth.
- `INTERNAL_SERVICE_KEY` igual en `banking-service`, `notifications-service` y `report-service`.

## 9) Notas para desarrollo

- Los servicios Node exponen Swagger en `/api-docs`.
- El frontend consume:
  - Auth: `VITE_AUTH_URL`
  - Products: `VITE_ADMIN_URL`
  - Banking: `VITE_BANKING_URL`
  - Reports: `VITE_REPORTS_URL`
  - Notifications: `VITE_NOTIFICATIONS_URL`

## 10) Autores

- Grupo **La 33**
- Angel Grijalva 2024337 
- Benjain Argueta 2024 
- Francisco Milian 2024

## 11) Licencia

MIT

