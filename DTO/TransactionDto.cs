using Finance_Management_Platform.Entities;

namespace Finance_Management_Platform.DTO
{
	public class TransactionDto
	{
		public int Id { get; set; }

		public DateTime Date { get; set; }

		public TransactionType Type { get; set; }

		public string Payee { get; set; } = string.Empty;

		public string Description { get; set; } = string.Empty;

		public decimal Amount { get; set; }

		public int AccountId { get; set; }

		public string AccountName { get; set; } = string.Empty;

		public string? ReferenceNumber { get; set; }

		public string? Notes { get; set; }

		public DateTime CreatedAt { get; set; }

		public DateTime? UpdatedAt { get; set; }
	}
}
