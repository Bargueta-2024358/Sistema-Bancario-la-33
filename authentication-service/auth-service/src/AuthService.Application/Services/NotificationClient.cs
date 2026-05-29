using System.Net.Http.Json;
using AuthService.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AuthService.Application.Services;

public class NotificationClient(
    HttpClient httpClient,
    IConfiguration configuration,
    ILogger<NotificationClient> logger) : INotificationClient
{
    private string ServiceKey =>
        configuration["Notifications:ServiceKey"] ?? "Banco33InternalKey2026";

    public async Task NotifyPasswordResetRequestedAsync(string userId, string? email)
    {
        await PostEventAsync("password-reset-requested", new { userId, email });
    }

    public async Task NotifyPasswordChangedAsync(string userId, string? email, string? userName)
    {
        await PostEventAsync("password-changed", new { userId, email, userName });
    }

    private async Task PostEventAsync(string path, object body)
    {
        var baseUrl = configuration["Notifications:BaseUrl"];
        if (string.IsNullOrWhiteSpace(baseUrl))
        {
            return;
        }

        try
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl.TrimEnd('/')}/api/events/{path}")
            {
                Content = JsonContent.Create(body),
            };
            request.Headers.TryAddWithoutValidation("x-service-key", ServiceKey);
            await httpClient.SendAsync(request);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "No se pudo enviar evento a Notifications Service ({Path})", path);
        }
    }
}
