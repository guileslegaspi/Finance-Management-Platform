using Finance_Management_Platform.DTO;
using Finance_Management_Platform.Entities;

namespace Finance_Management_Platform.Interfaces
{
	public interface ITransactionService
	{
		Task<TransactionDto> CreateTransactionAsync(CreateTransactionDto dto, int userId);

		Task<TransactionDto?> GetTransactionAsync(int id, int userId);

		Task<List<TransactionDto>> GetTransactionsAsync(int userId);

		Task<TransactionDto?> UpdateTransactionAsync(int id, UpdateTransactionDto dto, int userId);

		Task<bool> DeleteTransactionAsync(int id, int userId);
	}
}
