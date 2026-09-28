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
	public class AccountsController : ControllerBase
	{
		private readonly IAccountService _accountService;

		public AccountsController(IAccountService accountService)
		{
			_accountService = accountService;
		}

		[HttpGet]
		public async Task<IActionResult> GetAccounts()
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			if (!int.TryParse(userId, out int currentUserId))
			{
				return Unauthorized();
			}

			var accounts = await _accountService
				.GetAccountsAsync(currentUserId);

			return Ok(accounts);
		}

		[HttpPost]
		public async Task<IActionResult> CreateAccount(CreateAccountDto dto)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			if (!int.TryParse(userId, out int currentUserId))
			{
				return Unauthorized();
			}

			var account = await _accountService
				.CreateAccountAsync(dto, currentUserId);

			return Ok(account);
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetAccount(int id)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			if (!int.TryParse(userId, out int currentUserId))
			{
				return Unauthorized();
			}

			var account = await _accountService
				.GetAccountAsync(id, currentUserId);

			if (account == null)
			{
				return NotFound();
			}

			return Ok(account);
		}

		[HttpPut("{id}")]
		public async Task<IActionResult> UpdateAccount(
			int id,
			UpdateAccountDto dto)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			if (!int.TryParse(userId, out int currentUserId))
			{
				return Unauthorized();
			}

			var account = await _accountService
				.UpdateAccountAsync(id, dto, currentUserId);

			if (account == null)
			{
				return NotFound();
			}

			return Ok(account);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteAccount(int id)
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			if (!int.TryParse(userId, out int currentUserId))
			{
				return Unauthorized();
			}

			var deleted = await _accountService
				.DeleteAccountAsync(id, currentUserId);

			if (!deleted)
			{
				return NotFound();
			}

			return NoContent();
		}
	}
}