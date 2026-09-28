using Finance_Management_Platform.DTO;
using Finance_Management_Platform.Entities;

namespace Finance_Management_Platform.Interfaces
{
	public interface IAccountService
	{
		Task<List<Account>> GetAccountsAsync(int userId);

		Task<Account?> GetAccountAsync(int id, int userId);

		Task<Account?> CreateAccountAsync(CreateAccountDto dto, int userId);

		Task<Account?> UpdateAccountAsync(int id, UpdateAccountDto dto, int userId);

		Task<bool> DeleteAccountAsync(int id, int userId);
 	}
}
