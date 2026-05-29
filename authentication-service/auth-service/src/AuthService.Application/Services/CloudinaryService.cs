using AuthService.Application.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;

namespace AuthService.Application.Services;

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;
    private readonly IConfiguration _configuration;

    public CloudinaryService(IConfiguration configuration)
    {
        _configuration = configuration;

        var cloudName = configuration["CloudinarySettings:CloudName"]
                        ?? configuration["CloudinarySettings:Cloudname"]
                        ?? throw new InvalidOperationException("CloudinarySettings:CloudName no configurado");

        var apiKey = configuration["CloudinarySettings:ApiKey"]
                     ?? throw new InvalidOperationException("CloudinarySettings:ApiKey no configurado");

        var apiSecret = configuration["CloudinarySettings:ApiSecret"]
                        ?? throw new InvalidOperationException("CloudinarySettings:ApiSecret no configurado");

        _cloudinary = new Cloudinary(new Account(cloudName, apiKey, apiSecret));
    }

    private string CloudName =>
        _configuration["CloudinarySettings:CloudName"]
        ?? _configuration["CloudinarySettings:Cloudname"]
        ?? "dcroiajue";

    private string Folder =>
        _configuration["CloudinarySettings:Folder"]?.Trim('/') ?? "auth-b33-in6av/profiles";

    private string? UploadVersion =>
        _configuration["CloudinarySettings:UploadVersion"]?.Trim('/');

    private string DefaultAvatarFile =>
        _configuration["CloudinarySettings:DefaultAvatarPath"]?.Trim('/') ?? "DefaultAvatar_lunlmo.webp";

    public async Task<bool> DeleteImageAsync(string publicId)
    {
        try
        {
            var id = NormalizePublicId(publicId);
            var result = await _cloudinary.DeleteResourcesAsync(new DelResParams { PublicIds = [id] });
            return result.Deleted?.ContainsKey(id) == true;
        }
        catch
        {
            return false;
        }
    }

    public string GetDefaultAvatarUrl()
    {
        var file = DefaultAvatarFile;
        return file.Contains('/') ? file.Split('/').Last() : file;
    }

    public string GetFullImageUrl(string imagePath)
    {
        if (string.IsNullOrWhiteSpace(imagePath))
            return string.Empty;

        return imagePath;
    }

    public async Task<string> UploadImageAsync(IFileData imageFile, string fileName)
    {
        try
        {
            using var stream = new MemoryStream(imageFile.Data);
            var publicId = $"{Folder}/{Path.GetFileName(fileName)}";

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(imageFile.FileName, stream),
                PublicId = publicId,
                Overwrite = true,
                Transformation = new Transformation()
                    .Width(400)
                    .Height(400)
                    .Crop("fill")
                    .Gravity("face")
                    .Quality("auto")
                    .FetchFormat("auto"),
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
                throw new InvalidOperationException($"Cloudinary: {uploadResult.Error.Message}");

            return uploadResult.SecureUrl.ToString();
        }
        catch (Exception ex) when (ex is not InvalidOperationException)
        {
            throw new InvalidOperationException($"Error al subir la imagen a Cloudinary: {ex.Message}", ex);
        }
    }

    private string NormalizePublicId(string path)
    {
        var p = path.Trim().TrimStart('/');
        if (p.StartsWith("http", StringComparison.OrdinalIgnoreCase))
            return p;

        if (p.Contains('/'))
            return p;

        return $"{Folder}/{p}";
    }

    private string BuildDeliveryUrl(string publicId)
    {
        var id = publicId.Trim().TrimStart('/');
        var versionPart = string.IsNullOrEmpty(UploadVersion) ? "" : $"{UploadVersion}/";
        return $"https://res.cloudinary.com/{CloudName}/image/upload/{versionPart}{id}";
    }
}
