using System; // Adicionado para Guid e DateTime

namespace Backend.Models
{
    public class Score
    {
        public Guid Id { get; set; }
        public string PlayerName { get; set; }
        public int Points { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
