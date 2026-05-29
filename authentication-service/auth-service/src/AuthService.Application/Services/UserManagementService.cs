using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Domain.Constants;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;

namespace AuthService.Application.Services;

public class UserManagementService(
    IUserRepository users,
    IRoleRepository roles,
    ICloudinaryService cloudinary,
    IAuthService authService) : IUserManagementService
{
    private UserResponseDto MapUser(User user)
    {
        var dbRole = user.UserRoles.FirstOrDefault()?.Role?.Name ?? RoleConstants.USER_ROLE;
        return new UserResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Surname = user.SurName,
            Username = user.UserName,
            Email = user.Email,
            ProfilePicture = cloudinary.GetFullImageUrl(user.UserProfile?.ProfilePicture ?? string.Empty),
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

    public async Task<IReadOnlyList<UserResponseDto>> GetAllUsersAsync()
    {
        var all = await users.GetAllAsync();
        return all.Select(MapUser).ToList();
    }

    public async Task<UserResponseDto?> GetUserByIdAsync(string userId)
    {
        try
        {
            var user = await users.GetByIdAsync(userId);
            return MapUser(user);
        }
        catch
        {
            return null;
        }
    }

    public Task<RegisterResponseDto> CreateUserAsync(RegisterDto registerDto)
    {
        var requestedRole = registerDto.Role?.Trim().ToUpperInvariant();
        registerDto.Role = requestedRole switch
        {
            null or "" => RoleConstants.USER_ROLE,
            "USER_ROLE" or "USER" or "CLIENT" => RoleConstants.USER_ROLE,
            "ADMIN_ROLE" or "ADMIN" => RoleConstants.ADMIN_ROLE,
            _ => throw new InvalidOperationException("Rol inválido. Use USER_ROLE o ADMIN_ROLE"),
        };
        registerDto.ActivateImmediately = true;
        return authService.RegisterAsync(registerDto);
    }

    public async Task<UserResponseDto> UpdateUserRoleAsync(string userId, string roleName)
    {
        roleName = RoleConstants.NormalizeDbRole(roleName);

        if (string.IsNullOrWhiteSpace(userId)) throw new ArgumentException("Invalid userId", nameof(userId));
        if (!RoleConstants.AllowedRoles.Contains(roleName))
            throw new InvalidOperationException($"Role not allowed. Use {RoleConstants.ADMIN_ROLE} or {RoleConstants.USER_ROLE}");

        var user = await users.GetByIdAsync(userId);

        var isUserAdmin = user.UserRoles.Any(r => r.Role.Name == RoleConstants.ADMIN_ROLE);
        if (isUserAdmin && roleName != RoleConstants.ADMIN_ROLE)
        {
            var adminCount = await roles.CountUsersInRoleAsync(RoleConstants.ADMIN_ROLE);
            if (adminCount <= 1)
                throw new InvalidOperationException("Cannot remove the last administrator");
        }

        var role = await roles.GetByNameAsync(roleName)
                   ?? throw new InvalidOperationException($"Role {roleName} not found");

        await users.UpdateUserRolesAsync(userId, role.Id);
        user = await users.GetByIdAsync(userId);
        return MapUser(user);
    }

    public async Task<IReadOnlyList<string>> GetUserRolesAsync(string userId) =>
        await roles.GetUserRoleNameAsync(userId);

    public async Task<IReadOnlyList<UserResponseDto>> GetUsersByRoleAsync(string roleName)
    {
        roleName = roleName?.Trim().ToUpperInvariant() ?? string.Empty;
        var usersInRole = await roles.GetUsersByRoleAsync(roleName);
        return usersInRole.Select(u => MapUser(u)).ToList();
    }

    public async Task<bool> DeleteUserAsync(string userId)
    {
        var user = await users.GetByIdAsync(userId);
        var isAdmin = user.UserRoles.Any(r => r.Role?.Name == RoleConstants.ADMIN_ROLE);
        if (isAdmin)
        {
            var adminCount = await roles.CountUsersInRoleAsync(RoleConstants.ADMIN_ROLE);
            if (adminCount <= 1)
                throw new InvalidOperationException("Cannot delete the last administrator");
        }
        return await users.DeleteUserAsync(userId);
    }

    public async Task<UserResponseDto> UpdateUserAsync(string userId, AdminUpdateUserDto dto)
    {
        if (string.IsNullOrWhiteSpace(userId))
            throw new ArgumentException("Invalid userId", nameof(userId));

        var user = await users.GetByIdAsync(userId);

        if (!string.IsNullOrWhiteSpace(dto.Name))
            user.Name = dto.Name.Trim();
        if (!string.IsNullOrWhiteSpace(dto.Surname))
            user.SurName = dto.Surname.Trim();
        if (dto.Status.HasValue)
            user.Status = dto.Status.Value;

        if (user.UserProfile != null)
        {
            if (dto.Address != null)
                user.UserProfile.Address = dto.Address.Trim();
            if (dto.Job != null)
                user.UserProfile.Job = dto.Job.Trim();
            if (dto.Dpi != null)
                user.UserProfile.Dpi = dto.Dpi.Trim();
            if (dto.Income.HasValue)
                user.UserProfile.Income = dto.Income.Value;
            if (!string.IsNullOrWhiteSpace(dto.Phone))
                user.UserProfile.Phone = dto.Phone.Trim();
        }

        user.UpdatedAt = DateTime.UtcNow;
        await users.UpdateUserAsync(user);
        return MapUser(await users.GetByIdAsync(userId));
    }
}
