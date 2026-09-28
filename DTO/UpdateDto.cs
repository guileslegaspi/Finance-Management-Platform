namespace Finance_Management_Platform.DTO
{
	public class UpdateDto
	{
		public DateTime Date { get; set; }

		public string Payee { get; set; } = string.Empty;

		public string Description { get; set; } = string.Empty;

		public decimal Amount { get; set; }

		public string? ReferenceNumber { get; set; }

		public string? Notes { get; set; }
	}
}
