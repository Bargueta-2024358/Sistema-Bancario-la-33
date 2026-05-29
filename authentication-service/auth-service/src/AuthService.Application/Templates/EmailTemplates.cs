namespace AuthService.Application.Templates;

public static class EmailTemplates
{
    private const string BrandGold = "#fada28";
    private const string BrandBrown = "#3f3528";
    private const string BrandMuted = "#7b6b57";
    private const string BrandBg = "#f5f0e8";

    private static string Wrap(string title, string bodyContent) => $@"
<!DOCTYPE html>
<html lang=""es"">
<head>
  <meta charset=""UTF-8"" />
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"" />
  <title>{title}</title>
</head>
<body style=""margin:0;padding:0;background-color:{BrandBg};font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;color:{BrandBrown};"">
  <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""background-color:{BrandBg};padding:32px 16px;"">
    <tr>
      <td align=""center"">
        <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""max-width:560px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 12px 40px rgba(63,53,40,0.12);"">
          <tr>
            <td style=""background:linear-gradient(135deg,{BrandGold} 0%,#e8c420 100%);padding:28px 32px;text-align:center;"">
              <p style=""margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:{BrandBrown};opacity:0.85;"">Banco La 33</p>
              <h1 style=""margin:8px 0 0;font-size:26px;font-weight:800;color:{BrandBrown};"">{title}</h1>
            </td>
          </tr>
          <tr>
            <td style=""padding:32px;"">
              {bodyContent}
            </td>
          </tr>
          <tr>
            <td style=""padding:20px 32px 28px;border-top:1px solid #e6dccd;text-align:center;"">
              <p style=""margin:0;font-size:12px;color:{BrandMuted};"">© {DateTime.UtcNow.Year} Banco La 33 · Sistema bancario universitario</p>
              <p style=""margin:8px 0 0;font-size:11px;color:{BrandMuted};"">Si no solicitaste este correo, puedes ignorarlo con seguridad.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>";

    private static string PrimaryButton(string href, string label) => $@"
<table role=""presentation"" cellspacing=""0"" cellpadding=""0"" style=""margin:28px auto;"">
  <tr>
    <td style=""border-radius:999px;background:{BrandGold};box-shadow:0 8px 20px rgba(250,218,40,0.35);"">
      <a href=""{href}"" target=""_blank"" style=""display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:{BrandBrown};text-decoration:none;border-radius:999px;"">{label}</a>
    </td>
  </tr>
</table>";

    private static string LinkFallback(string url) => $@"
<p style=""margin:24px 0 8px;font-size:13px;color:{BrandMuted};"">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
<p style=""margin:0;padding:12px 14px;background:#faf6f0;border-radius:12px;font-size:12px;word-break:break-all;color:{BrandBrown};"">{url}</p>";

    public static string VerificationEmail(string username, string verificationUrl, string token) => Wrap(
        "Confirma tu correo",
        $@"
<p style=""margin:0 0 12px;font-size:16px;line-height:1.6;color:{BrandBrown};"">Hola <strong>{username}</strong>,</p>
<p style=""margin:0 0 8px;font-size:15px;line-height:1.6;color:{BrandMuted};"">
  Gracias por registrarte en <strong>Banco La 33</strong>. Solo falta un paso: confirma tu dirección de correo para activar tu cuenta.
</p>
{PrimaryButton(verificationUrl, "Confirmar mi correo")}
<p style=""margin:0 0 8px;font-size:13px;color:{BrandMuted};"">También puedes copiar este código y pegarlo en el formulario de confirmación:</p>
<p style=""margin:0;padding:14px 16px;background:#faf6f0;border:1px dashed #d9ccb8;border-radius:12px;font-size:12px;word-break:break-all;color:{BrandBrown};font-family:Consolas,Monaco,'Courier New',monospace;"">{token}</p>
{LinkFallback(verificationUrl)}
<p style=""margin:20px 0 0;font-size:13px;color:{BrandMuted};"">⏱ Este enlace expira en <strong>24 horas</strong>.</p>");

    public static string PasswordResetEmail(string username, string resetUrl) => Wrap(
        "Restablecer contraseña",
        $@"
<p style=""margin:0 0 12px;font-size:16px;line-height:1.6;color:{BrandBrown};"">Hola <strong>{username}</strong>,</p>
<p style=""margin:0 0 8px;font-size:15px;line-height:1.6;color:{BrandMuted};"">
  Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón para continuar.
</p>
{PrimaryButton(resetUrl, "Restablecer contraseña")}
{LinkFallback(resetUrl)}
<p style=""margin:20px 0 0;font-size:13px;color:{BrandMuted};"">⏱ Este enlace expira en <strong>1 hora</strong>. Si no solicitaste el cambio, ignora este mensaje.</p>");

    public static string WelcomeEmail(string username) => Wrap(
        "¡Cuenta activada!",
        $@"
<p style=""margin:0 0 12px;font-size:16px;line-height:1.6;color:{BrandBrown};"">¡Hola <strong>{username}</strong>!</p>
<p style=""margin:0 0 8px;font-size:15px;line-height:1.6;color:{BrandMuted};"">
  Tu correo fue verificado correctamente. Ya puedes iniciar sesión y usar todos los servicios de banca en línea de Banco La 33.
</p>
<table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""margin:24px 0;background:#faf6f0;border-radius:16px;padding:16px 20px;"">
  <tr>
    <td style=""font-size:14px;color:{BrandBrown};line-height:1.5;"">
      ✓ Cuenta activa<br/>
      ✓ Acceso a productos y cuentas<br/>
      ✓ Transferencias y más
    </td>
  </tr>
</table>
<p style=""margin:0;font-size:14px;color:{BrandMuted};"">¡Gracias por confiar en nosotros!</p>");
}
