using Finance_Management_Platform.Data;
using Finance_Management_Platform.DTO;
using Finance_Management_Platform.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Finance_Management_Platform.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AuthController : ControllerBase
	{
		private readonly ApplicationDbContext _context;
		private readonly PasswordHasher<User> _passwordHasher;
		private readonly IConfiguration _configuration;

		public AuthController(ApplicationDbContext context, PasswordHasher<User> passwordHasher, IConfiguration configuration) 
		{
			_context = context;
			_passwordHasher = passwordHasher;
			_configuration = configuration;
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register(RegisterDto register) 
		{
			var user = await _context.Users.FirstOrDefaultAsync(x => x.EmailAddress == register.EmailAddress);

			if (user != null) 
			{
				return Conflict(new
				{
					message = "Email Already registered"
				});
			}

			var newUser = new User
			{
				UserName = register.UserName,
				EmailAddress = register.EmailAddress,
			};

			newUser.PasswordHash = _passwordHasher.HashPassword(newUser, register.Password);

			_context.Users.Add(newUser);

			await _context.SaveChangesAsync();

			return Created("", new 
			{
				message = "Succesfully created"
			});
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login(LoginDto login)
		{
			var user = await _context.Users.FirstOrDefaultAsync(x => x.EmailAddress == login.EmailAddress);

			if (user == null)
			{
				return Unauthorized(new
				{
					message = "Email or password might be incorrect"
				});
			}

			var result = _passwordHasher.VerifyHashedPassword(
				user,
				user.PasswordHash,
				login.Password);

			if (result == PasswordVerificationResult.Failed)
			{
				return Unauthorized(new
				{
					message = "Email or password might be incorrect"
				});
			}

			var claims = new[]
			{
				new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
				new Claim(ClaimTypes.Email, user.EmailAddress!),
			};

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

			var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var token = new JwtSecurityToken(
					issuer: _configuration["Jwt:Issuer"],
					audience: _configuration["Jwt:Audience"],
					claims: claims,
					expires: DateTime.UtcNow.AddMinutes(60),
					signingCredentials: credentials
				);

			var jwt = new JwtSecurityTokenHandler().WriteToken(token);

			return Ok(new 
			{
				token = jwt
			});



		}

	}
}
