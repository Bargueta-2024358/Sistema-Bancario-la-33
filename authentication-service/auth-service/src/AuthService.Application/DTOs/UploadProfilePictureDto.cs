using System.ComponentModel.DataAnnotations;
using AuthService.Application.Interfaces;

namespace AuthService.Application.DTOs;

public class UploadProfilePictureDto
{
    [Required]
    public IFileData ProfilePicture { get; set; } = null!;
}
