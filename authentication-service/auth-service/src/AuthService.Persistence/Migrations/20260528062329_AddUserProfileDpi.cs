using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuthService.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUserProfileDpi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "dpi",
                table: "user_profiles",
                type: "character varying(13)",
                maxLength: 13,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "dpi",
                table: "user_profiles");
        }
    }
}
