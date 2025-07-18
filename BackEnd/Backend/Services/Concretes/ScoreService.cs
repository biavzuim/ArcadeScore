using Newtonsoft.Json;
using Backend.Services.Abstracts;
using Backend.Models;
using Backend.DTO_s;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System;

namespace Backend.Services.Concretes
{
    public class ScoreService : IScoreService
    {
        private readonly string _filePath = "Data/score-data.json";

        public ScoreService()
        {
            if (!File.Exists(_filePath))
                File.WriteAllText(_filePath, "[]");
        }

        public List<Score> GetAllScores()
        {
            var json = File.ReadAllText(_filePath);
            return JsonConvert.DeserializeObject<List<Score>>(json) ?? new List<Score>();
        }

        public bool RemoveScore(int id)
        {
            var scores = GetAllScores();
            var scoreToRemove = scores.FirstOrDefault(s => s.Id == id);

            if (scoreToRemove == null)
                return false;

            scores.Remove(scoreToRemove);
            File.WriteAllText(_filePath, JsonConvert.SerializeObject(scores, Formatting.Indented));
            return true;
        }

        public Score AddScore(ScoreDto dto)
        {
            var scores = GetAllScores();

            int newId = scores.Count > 0 ? scores.Max(s => s.Id) + 1 : 1;

            var score = new Score
            {
                Id = newId,
                PlayerName = dto.PlayerName ?? "Unknown Player", // Garante que PlayerName não seja nulo
                Points = dto.Points,
                CreatedAt = DateTime.UtcNow
            };

            scores.Add(score);
            File.WriteAllText(_filePath, JsonConvert.SerializeObject(scores, Formatting.Indented));

            return score;
        }

        public List<PlayerRankingDto> GetRanking()
        {
            var scores = GetAllScores();
            var ranking = scores
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
            var scores = GetAllScores();
            return scores
                .Where(s => s.PlayerName.Equals(playerName, StringComparison.OrdinalIgnoreCase))
                .Sum(s => s.Points);
        }

        public PlayerStatisticsDto GetPlayerStatistics(string playerName)
        {
            var playerScores = GetAllScores()
                .Where(s => s.PlayerName.Equals(playerName, StringComparison.OrdinalIgnoreCase))
                .OrderBy(s => s.CreatedAt)
                .ToList();

            // Filtra apenas as pontuações de jogos reais (pontos > 0) para as estatísticas
            var relevantScores = playerScores.Where(s => s.Points > 0).ToList();

            if (!relevantScores.Any())
            {
                // Se o jogador só tem pontuações de 0 pontos ou nenhuma pontuação,
                // as estatísticas devem refletir isso.
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

            foreach (var score in relevantScores) // Itera apenas sobre as pontuações relevantes
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

            DateTime firstGameDate = relevantScores.Min(s => s.CreatedAt); // Usa relevantScores
            DateTime lastGameDate = relevantScores.Max(s => s.CreatedAt);   // Usa relevantScores
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
            {
                return $"{ts.Days} dias, {ts.Hours} horas";
            }
            else if (ts.TotalHours >= 1)
            {
                return $"{ts.Hours} horas, {ts.Minutes} minutos";
            }
            else
            {
                return $"{ts.Minutes} minutos, {ts.Seconds} segundos";
            }
        }
    }
}
