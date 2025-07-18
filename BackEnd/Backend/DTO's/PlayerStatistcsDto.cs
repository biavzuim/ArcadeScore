using System;

namespace Backend.DTO_s
{
    public class PlayerStatisticsDto
    {
        public string? PlayerName { get; set; }
        public int GamesPlayed { get; set; }
        public double AverageScore { get; set; }
        public int HighestScore { get; set; }
        public int LowestScore { get; set; }
        public int RecordBrokenCount { get; set; }
        public string? TimePlaying { get; set; } // Alterado para string?
    }
}
