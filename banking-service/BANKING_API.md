# Banking Service API

Base: `http://localhost:3021`  
Swagger: `/api-docs`  
Auth: `Authorization: Bearer <token>` (JWT del Auth Service)

## Roles

- Admin: `ADMIN` / `ADMIN_ROLE`
- Cliente: `CLIENT` / `USER_ROLE`

## Límites

- Transferencia: máx. **Q2000** por operación
- Transferencias diarias: máx. **Q10000** por usuario
- Reversión de depósito admin: dentro de **1 minuto**

## Endpoints

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| POST | `/api/accounts` | Admin | Crear cuenta (genera número `33XXXXXXXX`) |
| GET | `/api/accounts` | Admin | Listar cuentas |
| GET | `/api/accounts/my` | Cliente | Mis cuentas |
| GET | `/api/accounts/user/:userId/balance` | Admin | Saldo por usuario |
| GET | `/api/accounts/top-movements` | Admin | Cuentas con más movimientos |
| PATCH | `/api/accounts/:n/deactivate` | Admin | Desactivar cuenta |
| POST | `/api/accounts/:n/admin-deposit` | Admin | Depósito administrativo |
| POST | `/api/accounts/deposits/:txId/revert` | Admin | Revertir depósito (<1 min) |
| GET | `/api/accounts/:n/last-movements` | Admin | Últimos 5 movimientos |
| POST | `/api/accounts/:n/deposit` | Cliente | Depósito |
| POST | `/api/accounts/:n/withdraw` | Cliente | Retiro |
| POST | `/api/accounts/:n/transfer` | Cliente | Transferencia |
| GET | `/api/accounts/:n/balance` | Cliente | Saldo |
| GET | `/api/accounts/:n/transactions` | Cliente | Historial |
| GET/POST/DELETE | `/api/accounts/favorites` | Cliente | Favoritos |

## Ejemplo transferencia

```json
POST /api/accounts/3312345678/transfer
{ "toAccountNumber": "3398765432", "amount": 500 }
```
