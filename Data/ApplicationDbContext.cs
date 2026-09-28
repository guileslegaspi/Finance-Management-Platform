using Finance_Management_Platform.Entities;
using Microsoft.EntityFrameworkCore;

namespace Finance_Management_Platform.Data
{
	public class ApplicationDbContext : DbContext
	{
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) 
		{

		}

		public DbSet<User> Users { get; set; }

		public DbSet<Expense> Expenses { get; set; }
	}
}
