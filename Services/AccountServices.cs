using Finance_Management_Platform.Data;
using Finance_Management_Platform.DTO;
using Finance_Management_Platform.Entities;
using Finance_Management_Platform.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Finance_Management_Platform.Services
{
	public class AccountServices : IAccountService
	{
		private readonly ApplicationDbContext _context;

		public AccountServices(ApplicationDbContext context) 
		{
			_context = context;
		}

		public async Task<List<Account>> GetAccountsAsync(int userId) 
		{
			return await _context.Accounts
				.Where(x => x.Id == userId)
				.ToListAsync();
		}

		public async Task<Account?> GetAccountAsync(int id, int userId)
		{
			return await _context.Accounts
				.FirstOrDefaultAsync(
					x => x.Id == id && x.UserId == userId
				);
		}

		public async Task<Account> CreateAccountAsync(CreateAccountDto dto, int userId)
		{
			var account = new Account
			{
				Name = dto.Name,
				Type = dto.Type,
				Balance = dto.Balance,
				UserId = userId
			};

			_context.Accounts.Add(account);

			await _context.SaveChangesAsync();

			return account;
		}

		public async Task<Account?> UpdateAccountAsync(int id, UpdateAccountDto dto, int userId)
		{
			var account = await _context.Accounts
				.FirstOrDefaultAsync(
					x => x.Id == id && x.UserId == userId
				);

			if (account == null)
			{
				return null;
			}

			account.Name = dto.Name;
			account.Type = dto.Type;
			account.Balance = dto.Balance;

			await _context.SaveChangesAsync();

			return account;
		}

		public async Task<bool> DeleteAccountAsync(int id, int userId)
		{
			var account = await _context.Accounts
				.FirstOrDefaultAsync(
					x => x.Id == id && x.UserId == userId
				);

			if (account == null)
			{
				return false;
			}

			_context.Accounts.Remove(account);

			await _context.SaveChangesAsync();

			return true;
		}

	}
}
