namespace Finance_Management_Platform.DTO
{
	public class CreateTransferDTO
	{
		public int AccountId { get; set; }
		public int DestinationAccountId { get; set; }
		public decimal Amount { get; set; }
		public DateTime Date { get; set; }
	}
}
