using AuthService.Api.Extensions;
using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AuthService.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize(Policy = AuthenticationExtensions.AdminPolicy)]
public class UsersController(IUserManagementService userManagement) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<object>> GetAll()
    {
        var users = await userManagement.GetAllUsersAsync();
        return Ok(new { success = true, data = users });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetById(string id)
    {
        var user = await userManagement.GetUserByIdAsync(id);
        if (user == null)
            return NotFound(new { success = false, message = "Usuario no encontrado" });
        return Ok(new { success = true, data = user });
    }

    [HttpPost]
    [RequestSizeLimit(10 * 1024 * 1024)]
    [EnableRateLimiting("AuthPolicy")]
    public async Task<ActionResult<RegisterResponseDto>> Create([FromForm] RegisterDto registerDto)
    {
        var result = await userManagement.CreateUserAsync(registerDto);
        return StatusCode(201, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<object>> Update(string id, [FromBody] AdminUpdateUserDto dto)
    {
        var user = await userManagement.UpdateUserAsync(id, dto);
        return Ok(new { success = true, data = user });
    }

    [HttpPut("{id}/role")]
    public async Task<ActionResult<object>> UpdateRole(string id, [FromBody] UpdateUserRoleDto dto)
    {
        var user = await userManagement.UpdateUserRoleAsync(id, dto.Role);
        return Ok(new { success = true, data = user });
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<object>> Delete(string id)
    {
        var deleted = await userManagement.DeleteUserAsync(id);
        if (!deleted)
            return NotFound(new { success = false, message = "Usuario no encontrado" });
        return Ok(new { success = true, message = "Usuario eliminado" });
    }
}

public class UpdateUserRoleDto
{
    public string Role { get; set; } = string.Empty;
}
