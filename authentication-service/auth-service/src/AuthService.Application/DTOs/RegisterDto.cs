using System.ComponentModel.DataAnnotations;
using AuthService.Application.Interfaces;

namespace AuthService.Application.DTOs;

public class RegisterDto
{
    [Required]
    [MaxLength(25)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(25)]
    public string Surname { get; set; } = string.Empty;

    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [StringLength(8, MinimumLength = 8)]
    public string Phone { get; set; } = string.Empty;

    [MaxLength(13)]
    public string? Dpi { get; set; }

    [MaxLength(200)]
    public string? Address { get; set; }

    [MaxLength(100)]
    public string? Job { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? Income { get; set; }

    public IFileData? ProfilePicture { get; set; }

    /// <summary>ADMIN_ROLE o USER_ROLE (solo creación por administrador).</summary>
    public string? Role { get; set; }

    /// <summary>Activa la cuenta al crearla (panel admin, sin verificación por email).</summary>
    public bool ActivateImmediately { get; set; }
}
