using System.ComponentModel.DataAnnotations.Schema;

namespace Finance_Management_Platform.Entities
{
	[Table("Transactions")]
	public class Transaction
	{
		public int Id { get; set; }

		public DateTime Date { get; set; }

		public TransactionType Type { get; set; }

		public string Payee { get; set; } = string.Empty;

		public string Description { get; set; } = string.Empty;

		public decimal Amount { get; set; }

		public string? ReferenceNumber { get; set; }

		public string? Notes { get; set; }

		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

		public DateTime? UpdatedAt { get; set; }

		public int AccountId { get; set; }
		public Account Account { get; set; } = null!;
		public int UserId { get; set; }
		public User User { get; set; } = null!;
	}
}
