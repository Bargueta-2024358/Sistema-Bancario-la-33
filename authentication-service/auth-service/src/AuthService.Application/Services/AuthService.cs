using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Application.Exceptions;
using AuthService.Application.Extensions;
using AuthService.Application.Validators;
using AuthService.Domain.Constants;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using AuthService.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using AuthService.Application.DTOs.Email;

namespace AuthService.Application.Services;

public class AuthService(
    IUserRepository userRepository,
    IRoleRepository roleRepository,
    IPasswordHashService passwordHashService,
    IJwtTokenService jwtTokenService,
    ICloudinaryService cloudinaryService,
    IEmailService emailService,
    INotificationClient notificationClient,
    IConfiguration configuration,
    ILogger<AuthService> logger) : IAuthService
{
    private readonly ICloudinaryService _cloudinaryService = cloudinaryService;
    public async Task<RegisterResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        registerDto.Name = registerDto.Name?.Trim() ?? string.Empty;
        registerDto.Surname = registerDto.Surname?.Trim() ?? string.Empty;
        registerDto.Username = registerDto.Username?.Trim() ?? string.Empty;
        registerDto.Phone = registerDto.Phone?.Trim() ?? string.Empty;
        registerDto.Dpi = registerDto.Dpi?.Trim();

        if (await userRepository.ExistsByEmailAsync(registerDto.Email))
        {
            logger.LogRegistrationWithExistingEmail();
            throw new BusinessException(ErrorCodes.EMAIL_ALREADY_EXISTS, "Email already exists");
        }

        if (await userRepository.ExistsByUsernameAsync(registerDto.Username))
        {
            logger.LogRegistrationWithExistingUsername();
            throw new BusinessException(ErrorCodes.USERNAME_ALREADY_EXISTS, "Username already exists");
        }

        if (await userRepository.ExistsByPhoneAsync(registerDto.Phone))
        {
            throw new BusinessException(ErrorCodes.PHONE_ALREADY_EXISTS, "Phone already exists");
        }

        if (!string.IsNullOrWhiteSpace(registerDto.Dpi) && await userRepository.ExistsByDpiAsync(registerDto.Dpi))
        {
            throw new BusinessException(ErrorCodes.DPI_ALREADY_EXISTS, "DPI already exists");
        }

        if (await userRepository.ExistsByFullNameAsync(registerDto.Name, registerDto.Surname))
        {
            throw new BusinessException(ErrorCodes.FULLNAME_ALREADY_EXISTS, "A user with the same name and surname already exists");
        }

        string profilePicturePath;

        if (registerDto.ProfilePicture != null && registerDto.ProfilePicture.Size > 0)
        {
            var (isValid, errorMessage) = FileValidator.ValidateImage(registerDto.ProfilePicture);
            if (!isValid)
            {
                logger.LogWarning($"File validation failed: {errorMessage}");
                throw new BusinessException(ErrorCodes.INVALID_FILE_FORMAT, errorMessage!);
            }

            try
            {
                var fileName = FileValidator.GenerateSecureFileName(registerDto.ProfilePicture.FileName);
                profilePicturePath = await _cloudinaryService.UploadImageAsync(registerDto.ProfilePicture, fileName);
            }
            catch (Exception)
            {
                logger.LogImageUploadError();
                throw new BusinessException(ErrorCodes.IMAGE_UPLOAD_FAILED, "Failed to upload profile image");
            }
        }
        else
        {
            profilePicturePath = _cloudinaryService.GetDefaultAvatarUrl();
        }

        var emailVerificationToken = TokenGenerator.GenerateEmailVerificationToken();

        var userId = UuidGenerator.GenerateUserId();
        var userProfileId = UuidGenerator.GenerateUserId();
        var userEmailId = UuidGenerator.GenerateUserId();
        var userRoleId = UuidGenerator.GenerateUserId();
        var userPasswordResetId = UuidGenerator.GenerateUserId();

        var roleName = RoleConstants.NormalizeDbRole(registerDto.Role);
        var defaultRole = await roleRepository.GetByNameAsync(roleName);
        if (defaultRole == null)
        {
            throw new InvalidOperationException($"Role '{roleName}' not found. Ensure seeding runs before registration.");
        }

        var user = new User
        {
            Id = userId,
            Name = registerDto.Name,
            SurName = registerDto.Surname,
            UserName = registerDto.Username,
            Email = registerDto.Email.ToLowerInvariant(),
            Password = passwordHashService.HashPassword(registerDto.Password),
            Status = registerDto.ActivateImmediately,
            UserProfile = new UserProfile
            {
                Id = userProfileId,
                UserId = userId,
                ProfilePicture = profilePicturePath,
                Phone = registerDto.Phone,
                Dpi = registerDto.Dpi?.Trim() ?? string.Empty,
                Address = registerDto.Address?.Trim() ?? string.Empty,
                Job = registerDto.Job?.Trim() ?? string.Empty,
                Income = registerDto.Income ?? 0
            },
            UserEmail = new UserEmail
            {
                Id = userEmailId,
                UserId = userId,
                EmailVerified = registerDto.ActivateImmediately,
                EmailVerificationToken = registerDto.ActivateImmediately ? null : emailVerificationToken,
                EmailVerificationTokenExpiry = registerDto.ActivateImmediately ? null : DateTime.UtcNow.AddHours(24)
            },
            UserRoles =
            [
                new Domain.Entities.UserRole
                {
                    Id = userRoleId,
                    UserId = userId,
                    RoleId = defaultRole.Id
                }
            ],
            UserPasswordReset = new UserPasswordReset
            {
                Id = userPasswordResetId,
                UserId = userId,
                PasswordResetToken = null,
                PasswordResetTokenExpiry = null
            }
        };

        var createdUser = await userRepository.CreateUserAsync(user);

        logger.LogUserRegistered(createdUser.UserName);

        if (!registerDto.ActivateImmediately)
        {
            _ = Task.Run(async () =>
            {
                try
                {
                    await emailService.SendEmailVerificationAsync(createdUser.Email, createdUser.UserName, emailVerificationToken);
                    logger.LogInformation("Verification email sent");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Failed to send verification email");
                }
            });
        }

        return new RegisterResponseDto
        {
            Success = true,
            User = MapToUserResponseDto(createdUser),
            Message = registerDto.ActivateImmediately
                ? "Usuario creado y activado correctamente."
                : "Usuario registrado. Verifica el email para activar la cuenta.",
            EmailVerificationRequired = !registerDto.ActivateImmediately
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        User? user = null;

        if (loginDto.EmailOrUsername.Contains('@'))
        {
            user = await userRepository.GetByEmailAsync(loginDto.EmailOrUsername.ToLowerInvariant());
        }
        else
        {
            user = await userRepository.GetByUsernameAsync(loginDto.EmailOrUsername);
        }

        if (user == null)
        {
            logger.LogFailedLoginAttempt();
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        if (!user.Status)
        {
            logger.LogFailedLoginAttempt();
            throw new UnauthorizedAccessException("User account is disabled");
        }

        if (!passwordHashService.VerifyPassword(loginDto.Password, user.Password))
        {
            logger.LogFailedLoginAttempt();
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        logger.LogUserLoggedIn();

        var token = jwtTokenService.GenerateToken(user);
        var expiryMinutes = int.Parse(configuration["JwtSettings:ExpiryInMinutes"] ?? "30");

        return new AuthResponseDto
        {
            Success = true,
            Message = "Login exitoso",
            Token = token,
            UserDetails = MapToUserDetailsDto(user),
            ExpiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes)
        };
    }

    private UserResponseDto MapToUserResponseDto(User user)
    {
        var dbRole = user.UserRoles.FirstOrDefault()?.Role?.Name ?? RoleConstants.USER_ROLE;
        return new UserResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Surname = user.SurName,
            Username = user.UserName,
            Email = user.Email,
            ProfilePicture = _cloudinaryService.GetFullImageUrl(user.UserProfile?.ProfilePicture ?? string.Empty),
            Phone = user.UserProfile?.Phone ?? string.Empty,
            Address = user.UserProfile?.Address ?? string.Empty,
            Job = user.UserProfile?.Job ?? string.Empty,
            Dpi = user.UserProfile?.Dpi ?? string.Empty,
            Income = user.UserProfile?.Income ?? 0,
            Role = RoleConstants.ToJwtRole(dbRole),
            Status = user.Status,
            IsEmailVerified = user.UserEmail?.EmailVerified ?? false,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }

    private UserDetailsDto MapToUserDetailsDto(User user)
    {
        var dbRole = user.UserRoles.FirstOrDefault()?.Role?.Name ?? RoleConstants.USER_ROLE;
        return new UserDetailsDto
        {
            Id = user.Id,
            Username = user.UserName,
            ProfilePicture = _cloudinaryService.GetFullImageUrl(user.UserProfile?.ProfilePicture ?? string.Empty),
            Role = RoleConstants.ToJwtRole(dbRole),
        };
    }

    public async Task<UserResponseDto> UpdateMyProfileAsync(string userId, UpdateProfileDto dto)
    {
        if (string.IsNullOrWhiteSpace(userId))
            throw new ArgumentException("Invalid userId", nameof(userId));

        var user = await userRepository.GetByIdAsync(userId);
        user.Name = dto.Name.Trim();
        if (user.UserProfile == null)
            throw new InvalidOperationException("Perfil de usuario no encontrado");

        user.UserProfile.Address = dto.Address?.Trim() ?? string.Empty;
        user.UserProfile.Job = dto.Job?.Trim() ?? string.Empty;
        user.UserProfile.Income = dto.Income;
        user.UpdatedAt = DateTime.UtcNow;

        await userRepository.UpdateUserAsync(user);
        return MapToUserResponseDto(await userRepository.GetByIdAsync(userId));
    }

    public async Task<UserResponseDto> UpdateProfilePictureAsync(string userId, UploadProfilePictureDto dto)
    {
        if (string.IsNullOrWhiteSpace(userId))
            throw new ArgumentException("Invalid userId", nameof(userId));

        var user = await userRepository.GetByIdAsync(userId)
            ?? throw new InvalidOperationException("Usuario no encontrado");

        if (user.UserProfile == null)
            throw new InvalidOperationException("Perfil de usuario no encontrado");

        var (isValid, errorMessage) = FileValidator.ValidateImage(dto.ProfilePicture);
        if (!isValid)
            throw new BusinessException(ErrorCodes.INVALID_FILE_FORMAT, errorMessage ?? "Archivo inválido");

        var fileName = FileValidator.GenerateSecureFileName(dto.ProfilePicture.FileName);
        var imageUrl = await _cloudinaryService.UploadImageAsync(dto.ProfilePicture, fileName);

        user.UserProfile.ProfilePicture = imageUrl;
        user.UpdatedAt = DateTime.UtcNow;

        await userRepository.UpdateUserAsync(user);
        return MapToUserResponseDto(await userRepository.GetByIdAsync(userId));
    }

    public async Task<EmailResponseDto> VerifyEmailAsync(VerifyEmailDto verifyEmailDto)
    {
        var user = await userRepository.GetByEmailVerificartionTokenAsync(verifyEmailDto.Token);
        if (user == null || user.UserEmail == null)
        {
            return new EmailResponseDto
            {
                Success = false,
                Message = "Token de verificación inválido o expirado"
            };
        }

        user.UserEmail.EmailVerified = true;
        user.Status = true;
        user.UserEmail.EmailVerificationToken = null;
        user.UserEmail.EmailVerificationTokenExpiry = null;

        await userRepository.UpdateUserAsync(user);

        try
        {
            await emailService.SendWelcomeEmailAsync(user.Email, user.UserName);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send welcome email to {Email}", user.Email);
        }

        logger.LogInformation("Email verified successfully for user {Username}", user.UserName);

        return new EmailResponseDto
        {
            Success = true,
            Message = "Email verificado exitosamente",
            Data = new
            {
                email = user.Email,
                verified = true
            }
        };
    }

    public async Task<EmailResponseDto> ResendVerificationEmailAsync(ResendVerificationDto resendDto)
    {
        var user = await userRepository.GetByEmailAsync(resendDto.Email);
        if (user == null || user.UserEmail == null)
        {
            return new EmailResponseDto
            {
                Success = false,
                Message = "Usuario no encontrado",
                Data = new { email = resendDto.Email, sent = false }
            };
        }

        if (user.UserEmail.EmailVerified)
        {
            return new EmailResponseDto
            {
                Success = false,
                Message = "El email ya ha sido verificado",
                Data = new { email = user.Email, verified = true }
            };
        }

        var newToken = TokenGenerator.GenerateEmailVerificationToken();
        user.UserEmail.EmailVerificationToken = newToken;
        user.UserEmail.EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24);

        await userRepository.UpdateUserAsync(user);

        try
        {
            await emailService.SendEmailVerificationAsync(user.Email, user.UserName, newToken);
            return new EmailResponseDto
            {
                Success = true,
                Message = "Email de verificación enviado exitosamente",
                Data = new { email = user.Email, sent = true }
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to resend verification email to {Email}", user.Email);
            return new EmailResponseDto
            {
                Success = false,
                Message = "Error al enviar el email de verificación",
                Data = new { email = user.Email, sent = false }
            };
        }
    }

    public async Task<EmailResponseDto> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
    {
        var user = await userRepository.GetByEmailAsync(forgotPasswordDto.Email);
        if (user == null)
        {
            return new EmailResponseDto
            {
                Success = true,
                Message = "Si el email existe, se ha enviado un enlace de recuperación",
                Data = new { email = forgotPasswordDto.Email, initiated = true }
            };
        }

        var resetToken = TokenGenerator.GeneratePasswordResetToken();

        if (user.UserPasswordReset == null)
        {
            user.UserPasswordReset = new UserPasswordReset
            {
                UserId = user.Id,
                PasswordResetToken = resetToken,
                PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1)
            };
        }
        else
        {
            user.UserPasswordReset.PasswordResetToken = resetToken;
            user.UserPasswordReset.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1);
        }

        await userRepository.UpdateUserAsync(user);

        try
        {
            await emailService.SendPasswordResetAsync(user.Email, user.UserName, resetToken);
            logger.LogInformation("Password reset email sent to {Email}", user.Email);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send password reset email to {Email}", user.Email);
        }

        await notificationClient.NotifyPasswordResetRequestedAsync(user.Id, user.Email);

        return new EmailResponseDto
        {
            Success = true,
            Message = "Si el email existe, se ha enviado un enlace de recuperación",
            Data = new { email = forgotPasswordDto.Email, initiated = true }
        };
    }

    public async Task<EmailResponseDto> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
    {
        var user = await userRepository.GetByPasswordResetTokenAsync(resetPasswordDto.Token);
        if (user == null || user.UserPasswordReset == null)
        {
            return new EmailResponseDto
            {
                Success = false,
                Message = "Token de reset inválido o expirado",
                Data = new { token = resetPasswordDto.Token, reset = false }
            };
        }

        user.Password = passwordHashService.HashPassword(resetPasswordDto.NewPassword);
        user.UserPasswordReset.PasswordResetToken = null;
        user.UserPasswordReset.PasswordResetTokenExpiry = null;

        await userRepository.UpdateUserAsync(user);

        logger.LogInformation("Password reset successfully for user {Username}", user.UserName);

        await notificationClient.NotifyPasswordChangedAsync(user.Id, user.Email, user.UserName);

        return new EmailResponseDto
        {
            Success = true,
            Message = "Contraseña actualizada exitosamente",
            Data = new { email = user.Email, reset = true }
        };
    }

    public async Task<UserResponseDto?> GetUserByIdAsync(string userId)
    {
        var user = await userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return null;
        }

        return MapToUserResponseDto(user);
    }
}

