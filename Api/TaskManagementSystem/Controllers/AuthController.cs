using Application.Interfaces;
using Application.Models.Application.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FileApplication.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Static credentials
            if (request.Username != "admin" || request.Password != "admin123")
            {
                return Unauthorized("Invalid username or password");
            }

            var token = _authService.GenerateToken(request.Username);

            return Ok(new
            {
                accessToken = token,
                tokenType = "Bearer"
            });
        }
    }
}
