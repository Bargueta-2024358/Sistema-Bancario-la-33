using System.ComponentModel.DataAnnotations;

namespace AuthService.Application.DTOs;

public class UpdateProfileDto
{
    [Required]
    [MaxLength(25)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Address { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Job { get; set; } = string.Empty;

    [Range(0, double.MaxValue, ErrorMessage = "Los ingresos no pueden ser negativos")]
    public decimal Income { get; set; }
}
