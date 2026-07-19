# Dockerfile para authentication-service (.NET 8)

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar solo los .csproj primero para aprovechar la cache de capas
COPY src/AuthService.Domain/*.csproj src/AuthService.Domain/
COPY src/AuthService.Application/*.csproj src/AuthService.Application/
COPY src/AuthService.Persistence/*.csproj src/AuthService.Persistence/
COPY src/AuthService.Api/*.csproj src/AuthService.Api/

RUN dotnet restore src/AuthService.Api/AuthService.Api.csproj

# Copiar el resto del código y publicar
COPY . .
RUN dotnet publish src/AuthService.Api/AuthService.Api.csproj -c Release -o /app/publish --no-restore

# Imagen final, más liviana (solo runtime, sin SDK)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Render/Railway inyectan la variable PORT en tiempo de ejecución; Kestrel debe
# escuchar en ese puerto dinámico (no se puede fijar con ENV en build time).
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["sh", "-c", "ASPNETCORE_URLS=http://+:$PORT dotnet AuthService.Api.dll"]
