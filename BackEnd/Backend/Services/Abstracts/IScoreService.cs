using Backend.DTO_s;
using Backend.Models;

namespace Backend.Services.Abstracts
{
    public interface IScoreService
    {
        List<Score> GetAllScores();
        Score AddScore(ScoreDto dto);

        bool RemoveScore(Guid id);

    }
}