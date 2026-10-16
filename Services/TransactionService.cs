using Finance_Management_Platform.Data;
using Finance_Management_Platform.DTO;
using Finance_Management_Platform.Entities;
using Finance_Management_Platform.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;


namespace Finance_Management_Platform.Services
{
	public class TransactionService : ITransactionService
	{
		private readonly ApplicationDbContext _context;

		public TransactionService(ApplicationDbContext context) 
		{
			_context = context;
		}

		public async Task<List<TransactionDto>> GetTransactionsAsync (int userId) 
		{
			return await _context.Transactions
				.Where(x => x.UserId == userId)
				.Select(x => new TransactionDto
				{
					Id = x.Id,
					Date = x.Date,
					Type = x.Type,
					Payee = x.Payee,
					Description = x.Description,
					Amount = x.Amount,
					AccountId = x.AccountId,
					AccountName = x.Account.Name,
					ReferenceNumber = x.ReferenceNumber,
					Notes = x.Notes,
					CreatedAt = x.CreatedAt,
					UpdatedAt = x.UpdatedAt
				})
				.ToListAsync();
		}

		public async Task<TransactionDto?> GetTransactionAsync(int id, int userId)
		{
			return await _context.Transactions
				.Where(x => x.Id == id && x.UserId == userId)
				.Select(x => new TransactionDto 
				{
					Id = x.Id,
					Date = x.Date,
					Type = x.Type,
					Payee = x.Payee,
					Description = x.Description,
					Amount = x.Amount,
					AccountId = x.AccountId,
					AccountName = x.Account.Name,
					ReferenceNumber = x.ReferenceNumber,
					Notes = x.Notes,
					CreatedAt = x.CreatedAt,
					UpdatedAt = x.UpdatedAt
				})
				.FirstOrDefaultAsync();
			
		}

		public async Task<TransactionDto> CreateTransactionAsync(CreateTransactionDto dto, int userId)
		{
			var account = await _context.Accounts.FirstOrDefaultAsync(x => x.Id == dto.AccountId && x.UserId == userId);

			if (account == null)
			{
				throw new InvalidOperationException("Account not found.");
			}

			var transaction = new Transaction
			{
				Date = DateTime.SpecifyKind(dto.Date, DateTimeKind.Utc),
				Type = dto.Type,
				Payee = dto.Payee,
				Description = dto.Description,
				Amount = dto.Amount,
				ReferenceNumber = dto.ReferenceNumber,
				Notes = dto.Notes,
				AccountId = dto.AccountId,
				UserId = userId
			};

			_context.Transactions.Add(transaction);

			if (transaction.Type == TransactionType.Income)
			{
				account.Balance += transaction.Amount;
			}
			else if (transaction.Type == TransactionType.Expense)
			{
				account.Balance -= transaction.Amount;
			}

			await _context.SaveChangesAsync();

			return new TransactionDto
			{
				Id = transaction.Id,
				Date = transaction.Date,
				Type = transaction.Type,
				Payee = transaction.Payee,
				Description = transaction.Description,
				Amount = transaction.Amount,
				AccountId = transaction.AccountId,
				AccountName = account.Name,
				ReferenceNumber = transaction.ReferenceNumber,
				Notes = transaction.Notes,
				CreatedAt = transaction.CreatedAt,
				UpdatedAt = transaction.UpdatedAt
			};
		}

		public async Task<TransactionDto?> UpdateTransactionAsync(int id, UpdateTransactionDto dto, int userId)
		{
			var transaction = await _context.Transactions.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

			if (transaction == null)
			{
				return null;
			}

			var oldAccount = await _context.Accounts
				.FirstOrDefaultAsync(x => x.Id == transaction.AccountId && x.UserId == userId);

			var newAccount = await _context.Accounts
				.FirstOrDefaultAsync(x => x.Id == dto.AccountId && x.UserId == userId);

			if (oldAccount == null || newAccount == null)
			{
				return null;
			}

			
			if (transaction.Type == TransactionType.Income)
			{
				oldAccount.Balance -= transaction.Amount;
			}
			else if (transaction.Type == TransactionType.Expense)
			{
				oldAccount.Balance += transaction.Amount;
			}

			
			transaction.Date = DateTime.SpecifyKind(dto.Date, DateTimeKind.Utc);
			transaction.Type = dto.Type;
			transaction.Payee = dto.Payee;
			transaction.Description = dto.Description;
			transaction.Amount = dto.Amount;
			transaction.ReferenceNumber = dto.ReferenceNumber;
			transaction.Notes = dto.Notes;
			transaction.AccountId = dto.AccountId;
			transaction.UpdatedAt = DateTime.UtcNow;

			
			if (transaction.Type == TransactionType.Income)
			{
				newAccount.Balance += transaction.Amount;
			}
			else if (transaction.Type == TransactionType.Expense)
			{
				newAccount.Balance -= transaction.Amount;
			}

			await _context.SaveChangesAsync();

			return new TransactionDto
			{
				Id = transaction.Id,
				Date = transaction.Date,
				Type = transaction.Type,
				Payee = transaction.Payee,
				Description = transaction.Description,
				Amount = transaction.Amount,
				AccountId = transaction.AccountId,
				AccountName = newAccount.Name,
				ReferenceNumber = transaction.ReferenceNumber,
				Notes = transaction.Notes,
				CreatedAt = transaction.CreatedAt,
				UpdatedAt = transaction.UpdatedAt
			};
		}

		public async Task<bool> DeleteTransactionAsync(int id, int userId)
		{
			var transaction = await _context.Transactions.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

			if (transaction == null)
			{
				return false;
			}

			var account = await _context.Accounts.FirstOrDefaultAsync(x => x.Id == transaction.AccountId && x.UserId == userId);

			if (account == null)
			{
				return false;
			}

			
			if (transaction.Type == TransactionType.Income)
			{
				account.Balance -= transaction.Amount;
			}
			else if (transaction.Type == TransactionType.Expense)
			{
				account.Balance += transaction.Amount;
			}

			_context.Transactions.Remove(transaction);

			await _context.SaveChangesAsync();

			return true;
		}

		public async Task<TransactionDto> CreateTransferAsync(
	CreateTransferDTO dto, int userId)
		{
			if (dto.AccountId == dto.DestinationAccountId)
			{
				throw new InvalidOperationException(
					"Source and destination accounts must be different.");
			}

			if (dto.Amount <= 0)
			{
				throw new InvalidOperationException(
					"Transfer amount must be greater than zero.");
			}

			var sourceAccount = await _context.Accounts
				.FirstOrDefaultAsync(x =>
					x.Id == dto.AccountId && x.UserId == userId);

			if (sourceAccount == null)
			{
				throw new InvalidOperationException(
					"Source account not found.");
			}

			var destinationAccount = await _context.Accounts
				.FirstOrDefaultAsync(x =>
					x.Id == dto.DestinationAccountId &&
					x.UserId == userId);

			if (destinationAccount == null)
			{
				throw new InvalidOperationException(
					"Destination account not found.");
			}

			if (sourceAccount.Balance < dto.Amount)
			{
				throw new InvalidOperationException(
					"Insufficient funds in source account.");
			}

			await using var dbTransaction =
				await _context.Database.BeginTransactionAsync();

			sourceAccount.Balance -= dto.Amount;
			destinationAccount.Balance += dto.Amount;

			var transaction = new Transaction
			{
				Date = DateTime.SpecifyKind(
					dto.Date, DateTimeKind.Utc),
				Type = TransactionType.Transfer,
				Payee = destinationAccount.Name,
				Description =
					$"Transfer from {sourceAccount.Name} to {destinationAccount.Name}",
				Amount = dto.Amount,
				AccountId = sourceAccount.Id,
				DestinationAccountId = destinationAccount.Id,
				UserId = userId
			};

			_context.Transactions.Add(transaction);

			await _context.SaveChangesAsync();
			await dbTransaction.CommitAsync();

			return new TransactionDto
			{
				Id = transaction.Id,
				Date = transaction.Date,
				Type = transaction.Type,
				Payee = transaction.Payee,
				Description = transaction.Description,
				Amount = transaction.Amount,
				AccountId = transaction.AccountId,
				AccountName = sourceAccount.Name,
				ReferenceNumber = transaction.ReferenceNumber,
				Notes = transaction.Notes,
				CreatedAt = transaction.CreatedAt,
				UpdatedAt = transaction.UpdatedAt
			};
		}

	}
}
