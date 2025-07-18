using Backend.DTO_s;
using Backend.Models;
using System.Collections.Generic;

namespace Backend.Services.Abstracts
{
    public interface IScoreService
    {
        List<Score> GetAllScores();
        Score AddScore(ScoreDto dto);
        bool RemoveScore(int id);
        List<PlayerRankingDto> GetRanking(); // Novo método
        int GetTotalScoreByPlayer(string playerName); // Novo método
        PlayerStatisticsDto GetPlayerStatistics(string playerName); // Novo método
    }
}
