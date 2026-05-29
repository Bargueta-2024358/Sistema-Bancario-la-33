namespace AuthService.Application.Interfaces;

public interface INotificationClient
{
    Task NotifyPasswordResetRequestedAsync(string userId, string? email);
    Task NotifyPasswordChangedAsync(string userId, string? email, string? userName);
}
