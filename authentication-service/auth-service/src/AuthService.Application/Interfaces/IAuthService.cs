using AuthService.Application.DTOs;
using AuthService.Application.DTOs.Email;

namespace AuthService.Application.Interfaces;

public interface IAuthService
{
    Task<RegisterResponseDto> RegisterAsync(RegisterDto registerDto);
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    Task<EmailResponseDto> VerifyEmailAsync(VerifyEmailDto verifyEmailDto);
    Task<EmailResponseDto> ResendVerificationEmailAsync(ResendVerificationDto resendDto);
    Task<EmailResponseDto> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto);
    Task<EmailResponseDto> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
    Task<UserResponseDto?> GetUserByIdAsync(string userId);
    Task<UserResponseDto> UpdateMyProfileAsync(string userId, UpdateProfileDto dto);
    Task<UserResponseDto> UpdateProfilePictureAsync(string userId, UploadProfilePictureDto dto);
}
