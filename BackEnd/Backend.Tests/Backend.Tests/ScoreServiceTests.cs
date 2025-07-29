using Xunit;
using Backend.Services.Concretes;
using Backend.Data;
using Backend.DTO_s;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Backend.Tests
{
    public class ScoreServiceTests
    {
        private AppDbContext GetDbContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;

            return new AppDbContext(options);
        }

        // --- ADD SCORE ---

        [Fact]
        public void AddScore_ValidScore_ShouldAddSuccessfully()
        {
            var context = GetDbContext(nameof(AddScore_ValidScore_ShouldAddSuccessfully));
            var service = new ScoreService(context);

            var dto = new ScoreDto { PlayerName = "Player1", Points = 100 };
            var result = service.AddScore(dto);

            Assert.NotNull(result);
            Assert.Equal("Player1", result.PlayerName);
            Assert.Equal(100, result.Points);
        }

        [Fact]
        public void AddScore_InvalidScore_ShouldThrowOrHandle()
        {
            var context = GetDbContext(nameof(AddScore_InvalidScore_ShouldThrowOrHandle));
            var service = new ScoreService(context);

            var dto = new ScoreDto { PlayerName = null, Points = -10 };

            // Dependendo da implementação, pode lançar exceção ou corrigir valores
            // Aqui vamos assumir que o método adiciona com PlayerName "Unknown Player" e aceita pontos negativos

            var result = service.AddScore(dto);

            Assert.NotNull(result);
            Assert.Equal("Unknown Player", result.PlayerName);
            Assert.Equal(-10, result.Points); // Se quiser que negativo seja inválido, aí tem que ajustar serviço para validar e lançar exceção
        }

        // --- REMOVE SCORE ---

        [Fact]
        public void RemoveScore_ExistingId_ShouldReturnTrue()
        {
            var context = GetDbContext(nameof(RemoveScore_ExistingId_ShouldReturnTrue));
            var service = new ScoreService(context);

            var score = service.AddScore(new ScoreDto { PlayerName = "Player1", Points = 50 });

            var removed = service.RemoveScore(score.Id);

            Assert.True(removed);
            Assert.Empty(service.GetAllScores());
        }

        [Fact]
        public void RemoveScore_NonExistingId_ShouldReturnFalse()
        {
            var context = GetDbContext(nameof(RemoveScore_NonExistingId_ShouldReturnFalse));
            var service = new ScoreService(context);

            var removed = service.RemoveScore(9999);

            Assert.False(removed);
        }

        // --- GET TOTAL SCORE BY PLAYER ---

        [Fact]
        public void GetTotalScoreByPlayer_ExistingPlayer_ShouldReturnSum()
        {
            var context = GetDbContext(nameof(GetTotalScoreByPlayer_ExistingPlayer_ShouldReturnSum));
            var service = new ScoreService(context);

            service.AddScore(new ScoreDto { PlayerName = "Player1", Points = 30 });
            service.AddScore(new ScoreDto { PlayerName = "Player1", Points = 70 });

            var total = service.GetTotalScoreByPlayer("Player1");

            Assert.Equal(100, total);
        }

        [Fact]
        public void GetTotalScoreByPlayer_NonExistingPlayer_ShouldReturnZero()
        {
            var context = GetDbContext(nameof(GetTotalScoreByPlayer_NonExistingPlayer_ShouldReturnZero));
            var service = new ScoreService(context);

            var total = service.GetTotalScoreByPlayer("NoPlayer");

            Assert.Equal(0, total);
        }

        // --- GET PLAYER STATISTICS ---

        [Fact]
        public void GetPlayerStatistics_ExistingPlayer_ShouldReturnCorrectStats()
        {
            var context = GetDbContext(nameof(GetPlayerStatistics_ExistingPlayer_ShouldReturnCorrectStats));
            var service = new ScoreService(context);

            service.AddScore(new ScoreDto { PlayerName = "Player1", Points = 10 });
            service.AddScore(new ScoreDto { PlayerName = "Player1", Points = 20 });
            service.AddScore(new ScoreDto { PlayerName = "Player1", Points = 30 });

            var stats = service.GetPlayerStatistics("Player1");

            Assert.Equal(3, stats.GamesPlayed);
            Assert.Equal(20, stats.AverageScore);
            Assert.Equal(30, stats.HighestScore);
            Assert.Equal(10, stats.LowestScore);
            Assert.True(stats.RecordBrokenCount >= 0);
            Assert.NotNull(stats.TimePlaying);
        }

        [Fact]
        public void GetPlayerStatistics_NonExistingPlayer_ShouldReturnEmptyStats()
        {
            var context = GetDbContext(nameof(GetPlayerStatistics_NonExistingPlayer_ShouldReturnEmptyStats));
            var service = new ScoreService(context);

            var stats = service.GetPlayerStatistics("NoPlayer");

            Assert.Equal(0, stats.GamesPlayed);
            Assert.Equal(0, stats.AverageScore);
            Assert.Equal(0, stats.HighestScore);
            Assert.Equal(0, stats.LowestScore);
            Assert.Equal(0, stats.RecordBrokenCount);
            Assert.Equal("N/A", stats.TimePlaying);
        }
    }
}
