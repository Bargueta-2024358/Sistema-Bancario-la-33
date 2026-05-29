using AuthService.Api.Extensions;
using AuthService.Api.Middlewares;
using AuthService.Api.ModelBinders;
using AuthService.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using NetEscapades.AspNetCore.SecurityHeaders.Infrastructure;
using Serilog;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;

var builder = WebApplication.CreateBuilder(args);

// Permite conexiones TLS en entornos locales con certificados no confiables.
System.Net.ServicePointManager.ServerCertificateValidationCallback += (sender, certificate, chain, sslPolicyErrors) => true;

// Configure Serilog from appsettings.json only (avoid duplicate sinks)
builder.Host.UseSerilog((context, services, loggerConfiguration) =>
    loggerConfiguration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services));

// Registro de servicios.
builder.Services.AddControllers(options =>
{
    // Soporte para enlaces de archivos en formularios multipart.
    options.ModelBinderProviders.Insert(0, new FileDataModelBinderProvider());
})
.AddJsonOptions(o =>
{
    // Salida JSON en camelCase para consistencia entre servicios.
    o.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});

// Extensiones de configuración del proyecto.
builder.Services.AddApiDocumentation();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddRateLimitingPolicies();

// Configuración de seguridad.
builder.Services.AddSecurityPolicies(builder.Configuration);
builder.Services.AddSecurityOptions();

var app = builder.Build();

// Pipeline HTTP.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(c =>
    {
        c.RouteTemplate = "swagger/{documentName}/swagger.json";
    });

    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "AuthService API V1");
        c.RoutePrefix = "swagger";
    });
}

// Logging de requests.
app.UseSerilogRequestLogging();

// Encabezados de seguridad.
app.UseSecurityHeaders(policies => policies
    .AddDefaultSecurityHeaders()
    .RemoveServerHeader()
    .AddFrameOptionsDeny()
    .AddXssProtectionBlock()
    .AddContentTypeOptionsNoSniff()
    .AddReferrerPolicyStrictOriginWhenCrossOrigin()
    .AddContentSecurityPolicy(builder =>
    {
        builder.AddDefaultSrc().Self();
        builder.AddScriptSrc().Self().UnsafeInline();
        builder.AddStyleSrc().Self().UnsafeInline();
        builder.AddImgSrc().Self().Data();
        builder.AddFontSrc().Self().Data();
        builder.AddConnectSrc().Self();
        builder.AddFrameAncestors().None();
        builder.AddBaseUri().Self();
        builder.AddFormAction().Self();
    })
    .AddCustomHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
    .AddCustomHeader("Cache-Control", "no-store, no-cache, must-revalidate, private")
);

// Manejo global de excepciones.
app.UseMiddleware<GlobalExceptionMiddleware>();

// Middlewares principales.
app.UseHttpsRedirection();
app.UseCors("DefaultCorsPolicy");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Endpoints de salud.
app.MapHealthChecks("/health");

app.MapGet("/health", () =>
{
    var response = new
    {
        status = "Saludable",
        timestamp = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    };
    return Results.Ok(response);
});

app.MapHealthChecks("/api/v1/health");

// Log de inicio con direcciones de escucha.
var startupLogger = app.Services.GetRequiredService<ILogger<Program>>();
app.Lifetime.ApplicationStarted.Register(() =>
{
    try
    {
        var server = app.Services.GetRequiredService<IServer>();
        var addressesFeature = server.Features.Get<IServerAddressesFeature>();
        var addresses = (IEnumerable<string>?)addressesFeature?.Addresses ?? app.Urls;

        if (addresses != null && addresses.Any())
        {
            foreach (var addr in addresses)
            {
                var health = $"{addr.TrimEnd('/')}/health";
                startupLogger.LogInformation("API de AuthService está ejecutándose en {Url}. Endpoint de salud: {HealthUrl}", addr, health);
            }
        }
        else
        {
            startupLogger.LogInformation("API de AuthService iniciada. Endpoint de salud: /health");
        }
    }
    catch (Exception ex)
    {
        startupLogger.LogWarning(ex, "Fallo al determinar las direcciones de escucha para el log de inicio");
    }
});

// Inicialización de base de datos y datos semilla.
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        logger.LogInformation("Verificando conexión a la base de datos...");

        await context.Database.MigrateAsync();

        logger.LogInformation("Base de datos lista. Ejecutando datos semilla...");
        await DataSeeder.SeedAsync(context);

        logger.LogInformation("Inicialización de base de datos completada exitosamente");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Ocurrió un error al inicializar la base de datos");
        throw;
    }
}

app.Run();
