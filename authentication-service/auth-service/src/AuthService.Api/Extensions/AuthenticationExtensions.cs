using System.Security.Claims;
using AuthService.Domain.Constants;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace AuthService.Api.Extensions;

public static class AuthenticationExtensions
{
    public const string AdminPolicy = "AdminOnly";

    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");

        services.AddAuthorization(options =>
        {
            options.AddPolicy(AdminPolicy, policy =>
                policy.RequireAssertion(ctx => HasAdminRole(ctx.User)));
        });

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.MapInboundClaims = false;

            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings["Issuer"],
                ValidAudience = jwtSettings["Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                ClockSkew = TimeSpan.Zero,
                NameClaimType = JwtRegisteredClaimNames.Sub,
                RoleClaimType = "role"
            };
        });

        return services;
    }

    private static bool HasAdminRole(ClaimsPrincipal user)
    {
        if (!user.Identity?.IsAuthenticated ?? true) return false;

        var allowed = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "ADMIN",
            "ADMIN_ROLE",
            RoleConstants.ADMIN_ROLE
        };

        return user.Claims.Any(c =>
            (c.Type == "role" || c.Type == ClaimTypes.Role) &&
            allowed.Contains(c.Value));
    }
}

