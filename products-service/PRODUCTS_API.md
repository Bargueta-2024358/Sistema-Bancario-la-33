# Products & Currency Service — Banco La 33

Base URL: `http://localhost:3001/BancoLa33/v1`  
Swagger: `http://localhost:3001/api-docs`

## Módulos

| Recurso | Descripción |
|---------|-------------|
| `accountTypes` | Tipos de cuenta con **tasa de interés** |
| `products` | Productos financieros (interés + moneda) |
| `currencies` | Catálogo de monedas |
| `exchangeRates` | Tasas locales (respaldo si falla API externa) |

## Conversión monetaria

**API externa:** [Frankfurter](https://www.frankfurter.app/) (sin API key).

```
GET /currencies/convert?fromCurrency=USD&toCurrency=GTQ&amount=100
GET /exchangeRates/convert?fromCurrency=USD&toCurrency=GTQ&amount=100
GET /currencies/external-rates?from=USD&to=GTQ
```

- Por defecto intenta la API externa; si falla, usa tasas activas en MongoDB.
- `preferLocal=true` fuerza solo BD local.

## Seed automático

Al iniciar se cargan: GTQ, USD, EUR, MXN; 4 tipos de cuenta; 3 productos; tasas USD↔GTQ de respaldo.

Desactivar: `SEED_DATA=false` en `.env`.

## Integración Banking

Al crear cuenta con `accountTypeId`, Banking valida contra `GET /accountTypes/:id`.

Variable: `PRODUCTS_SERVICE_URL=http://localhost:3001/BancoLa33/v1`

## Admin (JWT)

POST/PUT en monedas, productos, tipos de cuenta y tasas requieren token con rol `ADMIN_ROLE` o `ADMIN`.

Header: `Authorization: Bearer <token>` o `x-token`.
