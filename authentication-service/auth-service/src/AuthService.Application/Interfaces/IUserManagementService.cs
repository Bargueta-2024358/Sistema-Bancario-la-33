using AuthService.Application.DTOs;

namespace AuthService.Application.Interfaces;

public interface IUserManagementService
{
    Task<IReadOnlyList<UserResponseDto>> GetAllUsersAsync();
    Task<UserResponseDto?> GetUserByIdAsync(string userId);
    Task<RegisterResponseDto> CreateUserAsync(RegisterDto registerDto);
    Task<UserResponseDto> UpdateUserRoleAsync(string userId, string roleName);
    Task<IReadOnlyList<string>> GetUserRolesAsync(string userId);
    Task<IReadOnlyList<UserResponseDto>> GetUsersByRoleAsync(string roleName);
    Task<bool> DeleteUserAsync(string userId);
    Task<UserResponseDto> UpdateUserAsync(string userId, AdminUpdateUserDto dto);
}
