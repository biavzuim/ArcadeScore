using System; // Adicionado para ID e DateTime

namespace Backend.Models
{
    public class Score
    {
        public int Id { get; set; } = 0;
        public required string PlayerName { get; set; }
        public int Points { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
