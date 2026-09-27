using System.ComponentModel.DataAnnotations;

namespace Finance_Management_Platform.DTO
{
	public class RegisterDto
	{
		[Required]
		[EmailAddress]
		public string EmailAddress { get; set; } = string.Empty;

		[Required]
		[StringLength(255)]
		public string UserName { get; set; } = string.Empty;

		[Required]
		public string Password { get; set; } = string.Empty;
	}
}
