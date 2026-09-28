using Finance_Management_Platform.Entities;

namespace Finance_Management_Platform.DTO
{
	public class CreateAccountDto
	{
		public string Name { get; set; } = string.Empty;

		public AccountType Type { get; set; }

		public decimal Balance { get; set; }
	}
}
