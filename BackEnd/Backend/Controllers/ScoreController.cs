using Backend.DTO_s;
using Backend.Services.Abstracts;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScoreController : ControllerBase
    {
        private readonly IScoreService _scoreService;

        public ScoreController(IScoreService scoreService)
        {
            _scoreService = scoreService;
        }

        [HttpGet]
        public IActionResult GetScores()
        {
            return Ok(_scoreService.GetAllScores());
        }

        [HttpPost]
        public IActionResult AddScore([FromBody] ScoreDto dto)
        {
            var result = _scoreService.AddScore(dto);
            return CreatedAtAction(nameof(GetScores), new { id = result.Id }, result);
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteScore(Guid id)
        {
            var removed = _scoreService.RemoveScore(id);
            if (!removed)
                return NotFound();

            return NoContent();
        }

    }
}
