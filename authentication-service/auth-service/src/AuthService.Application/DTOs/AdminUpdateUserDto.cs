using System.ComponentModel.DataAnnotations;

namespace AuthService.Application.DTOs;

public class AdminUpdateUserDto
{
    [MaxLength(25)]
    public string? Name { get; set; }

    [MaxLength(25)]
    public string? Surname { get; set; }

    [MaxLength(200)]
    public string? Address { get; set; }

    [MaxLength(100)]
    public string? Job { get; set; }

    [MaxLength(13)]
    [RegularExpression(@"^\d{13}$")]
    public string? Dpi { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? Income { get; set; }

    [StringLength(8, MinimumLength = 8)]
    [RegularExpression(@"^\d{8}$")]
    public string? Phone { get; set; }

    public bool? Status { get; set; }
}
