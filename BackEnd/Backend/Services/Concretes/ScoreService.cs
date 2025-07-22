using Backend.Data;
using Backend.DTO_s;
using Backend.Models;
using Backend.Services.Abstracts;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Services.Concretes
{
    public class ScoreService : IScoreService
    {
        private readonly AppDbContext _context;

        public ScoreService(AppDbContext context)
        {
            _context = context;

            // Se quiser inicializar a tabela com lista vazia no construtor
            if (!_context.Scores.Any())
            {
                _context.Scores.AddRange(new List<Score>()); // Opcional, só para garantir
                _context.SaveChanges();
            }
        }

        public List<Score> GetAllScores()
        {
            return _context.Scores.ToList();
        }

        public bool RemoveScore(int id)
        {
            var scoreToRemove = _context.Scores.FirstOrDefault(s => s.Id == id);
            if (scoreToRemove == null)
                return false;

            _context.Scores.Remove(scoreToRemove);
            _context.SaveChanges();

            return true;
        }

        public Score AddScore(ScoreDto dto)
        {
            int newId = _context.Scores.Any() ? _context.Scores.Max(s => s.Id) + 1 : 1;

            var score = new Score
            {
                Id = newId,
                PlayerName = dto.PlayerName ?? "Unknown Player",
                Points = dto.Points,
                CreatedAt = DateTime.UtcNow
            };

            _context.Scores.Add(score);
            _context.SaveChanges();

            return score;
        }

        public List<PlayerRankingDto> GetRanking()
        {
            var ranking = _context.Scores
                .GroupBy(s => s.PlayerName)
                .Select(g => new PlayerRankingDto
                {
                    PlayerName = g.Key,
                    TotalScore = g.Sum(s => s.Points)
                })
                .OrderByDescending(r => r.TotalScore)
                .Take(10)
                .ToList();

            return ranking;
        }

        public int GetTotalScoreByPlayer(string playerName)
        {
            return _context.Scores
                .Where(s => s.PlayerName.Equals(playerName, StringComparison.OrdinalIgnoreCase))
                .Sum(s => s.Points);
        }

        public PlayerStatisticsDto GetPlayerStatistics(string playerName)
        {
            var playerScores = _context.Scores
                .Where(s => s.PlayerName.Equals(playerName, StringComparison.OrdinalIgnoreCase))
                .OrderBy(s => s.CreatedAt)
                .ToList();

            var relevantScores = playerScores.Where(s => s.Points > 0).ToList();

            if (!relevantScores.Any())
            {
                return new PlayerStatisticsDto
                {
                    PlayerName = playerName,
                    GamesPlayed = 0,
                    AverageScore = 0,
                    HighestScore = 0,
                    LowestScore = 0,
                    RecordBrokenCount = 0,
                    TimePlaying = "N/A"
                };
            }

            int gamesPlayed = relevantScores.Count;
            double averageScore = relevantScores.Average(s => s.Points);
            int highestScore = relevantScores.Max(s => s.Points);
            int lowestScore = relevantScores.Min(s => s.Points);

            int recordBrokenCount = 0;
            int currentHighest = 0;
            bool firstScoreProcessed = false;

            foreach (var score in relevantScores)
            {
                if (!firstScoreProcessed)
                {
                    currentHighest = score.Points;
                    firstScoreProcessed = true;
                }
                else if (score.Points > currentHighest)
                {
                    currentHighest = score.Points;
                    recordBrokenCount++;
                }
            }

            DateTime firstGameDate = relevantScores.Min(s => s.CreatedAt);
            DateTime lastGameDate = relevantScores.Max(s => s.CreatedAt);
            TimeSpan timeSpan = lastGameDate - firstGameDate;

            string timePlaying = FormatTimeSpan(timeSpan);

            return new PlayerStatisticsDto
            {
                PlayerName = playerName,
                GamesPlayed = gamesPlayed,
                AverageScore = averageScore,
                HighestScore = highestScore,
                LowestScore = lowestScore,
                RecordBrokenCount = recordBrokenCount,
                TimePlaying = timePlaying
            };
        }

        private string FormatTimeSpan(TimeSpan ts)
        {
            if (ts.TotalDays >= 1)
                return $"{ts.Days} days, {ts.Hours} hours";
            else if (ts.TotalHours >= 1)
                return $"{ts.Hours} hours, {ts.Minutes} minutes";
            else
                return $"{ts.Minutes} minutes, {ts.Seconds} seconds";
        }
    }
}
