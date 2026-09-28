using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Finance_Management_Platform.Entities
{
	[Table("user")]
	public class User
	{
		[Key]
		public int Id { get; set; }

		[Required]
		[EmailAddress]
		public string EmailAddress { get; set; } = string.Empty;

		[Required]
		[StringLength(255)]
		public string UserName { get; set; } = string.Empty;

		[Required]
		public string PasswordHash { get; set; } = string.Empty;

		public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
	}
}
