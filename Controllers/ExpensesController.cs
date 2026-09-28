using Finance_Management_Platform.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Finance_Management_Platform.Controllers
{
	[Authorize]
	[ApiController]
	[Route("api/[controller]")]
	public class ExpensesController : ControllerBase
	{
		private readonly ApplicationDbContext _context;

		public ExpensesController(ApplicationDbContext context) 
		{
			_context = context;
		}

		[HttpGet]
		public async Task<IActionResult> GetExpenses() 
		{
			var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

			if (!int.TryParse(userId, out int currentUserId)) 
			{
				return Unauthorized();
			}

			var expenses = await _context.Expenses
				.Where(e => e.UserId == int.Parse(userId))
				.ToListAsync();

			return Ok(expenses);
		}
	}
}
