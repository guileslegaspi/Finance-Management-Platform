using Finance_Management_Platform.DTO;
using Finance_Management_Platform.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Finance_Management_Platform.Controllers
{
	[Authorize]
	[ApiController]
	[Route("api/[controller]")]
	public class TransactionsController : ControllerBase
	{
		private readonly ITransactionService _transactionService;

		public TransactionsController(ITransactionService transactionService)
		{
			_transactionService = transactionService;
		}

		[HttpGet]
		public async Task<IActionResult> GetTransactions()
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			if (!int.TryParse(userId, out int currentUserId))
			{
				return Unauthorized();
			}

			var transactions = await _transactionService
				.GetTransactionsAsync(currentUserId);

			return Ok(transactions);
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetTransaction(int id)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			if (!int.TryParse(userId, out int currentUserId))
			{
				return Unauthorized();
			}

			var transaction = await _transactionService
				.GetTransactionAsync(id, currentUserId);

			if (transaction == null)
			{
				return NotFound();
			}

			return Ok(transaction);
		}

		[HttpPost]
		public async Task<IActionResult> CreateTransaction(CreateTransactionDto dto)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			if (!int.TryParse(userId, out int currentUserId))
			{
				return Unauthorized();
			}

			try
			{
				var transaction = await _transactionService
					.CreateTransactionAsync(dto, currentUserId);

				return Ok(transaction);
			}
			catch (InvalidOperationException)
			{
				return NotFound();
			}
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateTransaction(
			int id,
			UpdateTransactionDto dto)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			if (!int.TryParse(userId, out int currentUserId))
			{
				return Unauthorized();
			}

			var transaction = await _transactionService
				.UpdateTransactionAsync(id, dto, currentUserId);

			if (transaction == null)
			{
				return NotFound();
			}

			return Ok(transaction);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteTransaction(int id)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			if (!int.TryParse(userId, out int currentUserId))
			{
				return Unauthorized();
			}

			var deleted = await _transactionService
				.DeleteTransactionAsync(id, currentUserId);

			if (!deleted)
			{
				return NotFound();
			}

			return NoContent();
		}
	}
}