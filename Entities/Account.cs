namespace Finance_Management_Platform.Entities
{
	public class Account
	{
		public int Id { get; set; }

		public string Name { get; set; } = string.Empty;

		public AccountType Type { get; set; }

		public decimal Balance { get; set; }

		public int UserId { get; set; }
		public User User { get; set; } = null!;

		public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
	}
}
