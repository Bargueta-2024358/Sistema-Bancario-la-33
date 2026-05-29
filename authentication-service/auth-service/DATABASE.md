# Base de datos - Auth Service (PostgreSQL)

## Requisitos

- PostgreSQL 13+ (Docker: `postgre_db_33/docker-compose.yml`, puerto **5436**)
- Base de datos: `banco_33_users`

## Crear base de datos desde cero

```bash
# 1. Levantar PostgreSQL
cd postgre_db_33
docker-compose up -d

# 2. (Opcional) Si ya existían tablas sin migraciones EF, limpiar:
# psql -h localhost -p 5436 -U IN6AV -d banco_33_users -f authentication-service/auth-service/scripts/reset-database.sql

# 3. Aplicar migraciones
cd authentication-service/auth-service/src/AuthService.Api
dotnet ef database update --project ../AuthService.Persistence
```

## Seed automático

Al arrancar la API (`dotnet run`), después de `MigrateAsync()` se ejecuta:

- Roles: `ADMIN`, `CLIENT`
- Usuario: `ADMINB` / `ADMINB`

## Tablas

| Tabla | Descripción |
|-------|-------------|
| `roles` | ADMIN, CLIENT |
| `users` | Usuarios del sistema |
| `user_profiles` | Teléfono, dirección, trabajo, ingresos |
| `user_emails` | Verificación de correo |
| `user_password_resets` | Tokens de recuperación |
| `user_roles` | Relación usuario-rol |

## Índices únicos

- `users.user_name`, `users.email`
- `roles.name`
- `user_profiles.user_id`
- `user_emails.user_id`
- `user_password_resets.user_id`
- `user_roles (user_id, role_id)`
