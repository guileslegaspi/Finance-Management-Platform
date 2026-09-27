using System.ComponentModel.DataAnnotations;

namespace Finance_Management_Platform.DTO
{
	public class LoginDto
	{
		[Required]
		[EmailAddress]
		public string EmailAddress { get; set; } = string.Empty;

		[Required]
		public string Password { get; set; } = string.Empty;
	}
}
