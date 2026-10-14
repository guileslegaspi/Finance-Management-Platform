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

		public DbSet<Transaction> Transactions { get; set; }

		public DbSet<Account> Accounts { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<Transaction>()
				.HasOne(t => t.Account)
				.WithMany()
				.HasForeignKey(t => t.AccountId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Transaction>()
				.HasOne(t => t.DestinationAccount)
				.WithMany()
				.HasForeignKey(t => t.DestinationAccountId)
				.OnDelete(DeleteBehavior.Restrict);
		}
	}
}
