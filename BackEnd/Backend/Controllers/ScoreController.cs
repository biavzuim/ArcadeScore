using Backend.DTO_s; 
using Backend.Services.Abstracts;
using Microsoft.AspNetCore.Mvc; 
using System;

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

        [HttpPost]//*responde a uma requisição Post
        public IActionResult AddScore([FromBody] ScoreDto dto) 
        {
            var result = _scoreService.AddScore(dto); 

            return Created("", result);
           
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteScore(int id)
        {
            var removed = _scoreService.RemoveScore(id);
            if (!removed)
                return NotFound();

            return NoContent();
        }

        [HttpGet("ranking")]
        public IActionResult GetRanking()
        {
            return Ok(_scoreService.GetRanking());
        }

        [HttpGet("player/{playerName}/total")]
        public IActionResult GetTotalScoreByPlayer(string playerName)
        {
            var totalScore = _scoreService.GetTotalScoreByPlayer(playerName);
            return Ok(totalScore);
        }

        [HttpGet("player/{playerName}/statistics")]
        public IActionResult GetPlayerStatistics(string playerName)
        {
            var stats = _scoreService.GetPlayerStatistics(playerName);
            if (stats.GamesPlayed == 0)
            {
                return NotFound($"No statistics found for player: {playerName}");
            }
            return Ok(stats);
        }
    }
}
