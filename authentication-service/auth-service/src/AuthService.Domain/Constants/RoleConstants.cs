using System;

namespace AuthService.Domain.Constants;

public class RoleConstants
{
    public const string USER_ROLE = "USER_ROLE";
    public const string ADMIN_ROLE = "ADMIN_ROLE";

    public static readonly string[] AllowedRoles = [USER_ROLE, ADMIN_ROLE];

    public static string ToJwtRole(string dbRole) => dbRole switch
    {
        ADMIN_ROLE => "ADMIN",
        USER_ROLE => "CLIENT",
        "ADMIN" => "ADMIN",
        "CLIENT" => "CLIENT",
        _ => dbRole
    };

    public static string NormalizeDbRole(string? role)
    {
        if (string.IsNullOrWhiteSpace(role)) return USER_ROLE;
        var r = role.Trim().ToUpperInvariant();
        return r switch
        {
            "ADMIN" or "ADMIN_ROLE" => ADMIN_ROLE,
            "CLIENT" or "USER" or "USER_ROLE" => USER_ROLE,
            _ => AllowedRoles.Contains(r) ? r : USER_ROLE
        };
    }
}
