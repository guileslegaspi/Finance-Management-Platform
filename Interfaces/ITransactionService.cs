using Finance_Management_Platform.DTO;
using Finance_Management_Platform.Entities;

namespace Finance_Management_Platform.Interfaces
{
	public interface ITransactionService
	{
		Task<Transaction> CreateTransactionAsync(CreateTransactionDto dto, int userId);

		Task<Transaction?> GetTransactionAsync(int id, int userId);

		Task<List<Transaction>> GetTransactionsAsync(int userId);

		Task<Transaction?> UpdateTransactionAsync(int id, UpdateTransactionDto dto, int userId);

		Task<bool> DeleteTransactionAsync(int id, int userId);
	}
}
