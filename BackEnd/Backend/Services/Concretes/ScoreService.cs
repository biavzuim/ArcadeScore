using Newtonsoft.Json;
using Backend.Services.Abstracts;
using Backend.Models;
using Backend.DTO_s;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Backend.Services.Concretes
{
    public class ScoreService : IScoreService
    {
        // Caminho do arquivo onde os dados dos scores são salvos localmente
        private readonly string _filePath = "Data/score-data.json";

        public ScoreService()
        {
            // Se o arquivo ainda não existir, cria um novo arquivo vazio com um array JSON
            if (!File.Exists(_filePath))
                File.WriteAllText(_filePath, "[]");
        }

        /// <summary>
        /// Lê todos os scores armazenados no arquivo JSON.
        /// </summary>
        /// <returns>Lista de objetos Score</returns>
        public List<Score> GetAllScores()
        {
            var json = File.ReadAllText(_filePath); // Lê o conteúdo do arquivo
            return JsonConvert.DeserializeObject<List<Score>>(json); // Converte de JSON para lista de Score
        }

        /// <summary>
        /// Remove um score com base no ID fornecido.
        /// </summary>
        /// <param name="id">ID do score a ser removido</param>
        /// <returns>True se removido com sucesso, false se não encontrado</returns>
        public bool RemoveScore(Guid id)
        {
            var scores = GetAllScores(); // Carrega todos os scores
            var scoreToRemove = scores.FirstOrDefault(s => s.Id == id); // Procura o score com o ID fornecido

            if (scoreToRemove == null)
                return false; // Não encontrou o score para remover

            scores.Remove(scoreToRemove); // Remove da lista
            File.WriteAllText(_filePath, JsonConvert.SerializeObject(scores, Formatting.Indented)); // Salva a nova lista no arquivo
            return true; // Remoção bem-sucedida
        }

        /// <summary>
        /// Adiciona um novo score com base nos dados recebidos (DTO).
        /// </summary>
        /// <param name="dto">Dados do novo score (nome do jogador e pontos)</param>
        /// <returns>O score criado com ID e data de criação</returns>
        public Score AddScore(ScoreDto dto)
        {
            var scores = GetAllScores(); // Carrega os scores existentes

            var score = new Score
            {
                Id = Guid.NewGuid(), // Gera um novo ID único
                PlayerName = dto.PlayerName, // Nome do jogador
                Points = dto.Points,         // Pontuação
                CreatedAt = DateTime.UtcNow  // Data atual (UTC)
            };

            scores.Add(score); // Adiciona o novo score à lista
            File.WriteAllText(_filePath, JsonConvert.SerializeObject(scores, Formatting.Indented)); // Salva a lista atualizada no arquivo

            return score; // Retorna o novo score criado
        }
    }
}
