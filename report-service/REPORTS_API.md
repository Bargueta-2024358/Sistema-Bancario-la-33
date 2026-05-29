# Report Service — Banco La 33

Puerto: **3022**  
PostgreSQL: `banco_33_reports`

## Sync desde Banking

`POST /api/transactions` con header `x-service-key` (opcional si está configurado).

Body:
```json
{
  "userId": "...",
  "accountNumber": "1234567890",
  "type": "TRANSFER_OUT",
  "amount": 500,
  "targetAccountNumber": "...",
  "description": "..."
}
```

## Reportes (JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/reports/history/:userId` | Historial bancario |
| GET | `/api/reports/history/:userId/export?format=pdf\|xlsx` | Exportar historial |
| GET | `/api/reports/account-statement/:accountNumber?userId=` | Estado de cuenta |
| GET | `/api/reports/account-statement/:accountNumber/export?format=` | Exportar estado |
| GET | `/api/reports/financial/:userId` | Reporte financiero |
| GET | `/api/reports/statistics/:userId` | Estadísticas |
| GET | `/api/reports/global` | Resumen admin |

Query común: `from`, `to`, `accountNumber`, `type`, `limit`, `offset`

## Crear BD

```sql
CREATE DATABASE banco_33_reports;
```

O usar el script en `postgre_db_33/init-reports-db.sql`.
