import { Component,  OnInit } from "@angular/core" // Importe Component e OnInit
import  { PlayersService, Player } from "../players.service"
import  { RankingService, PlayerStatistics } from "../ranking.service"

@Component({
  // Certifique-se de que o decorator @Component está aqui
  selector: "app-players",
  templateUrl: "./players.component.html",
  styleUrls: ["./players.component.css"],
})
export class PlayersComponent implements OnInit {
  players: Player[] = []
  selectedPlayer: Player | null = null
  totalScore = 0
  newPlayerName = ""
  playerStatistics: PlayerStatistics | null = null

  constructor(
    private playersService: PlayersService,
    private rankingService: RankingService,
  ) {}

  ngOnInit(): void {
    this.loadPlayers()
  }

  loadPlayers(): void {
    this.playersService.getPlayers().subscribe({
      next: (players: Player[]) => {
        this.players = players
      },
      error: (error: any) => {
        console.error("Erro ao carregar jogadores:", error)
        alert("Erro ao carregar jogadores")
      },
    })
  }

  selectPlayer(player: Player): void {
    this.selectedPlayer = player
    this.totalScore = 0
    this.playerStatistics = null

    if (player.playerName) {
      this.rankingService.getTotalScoreByPlayer(player.playerName).subscribe({
        next: (total: number) => {
          this.totalScore = total
        },
        error: (error: any) => {
          console.error("Erro ao carregar pontuação total:", error)
          this.totalScore = 0
        },
      })
    }
  }

  addPlayer(): void {
    const trimmedName = this.newPlayerName.trim()
    if (trimmedName) {
      this.playersService.addPlayer(trimmedName).subscribe({
        next: (newPlayer: Player) => {
          this.newPlayerName = ""
          this.loadPlayers()
        },
        error: (error: any) => {
          console.error("Erro ao adicionar jogador:", error)
          alert("Erro ao adicionar jogador")
        },
      })
    }
  }

  viewPlayerStatistics(playerName: string): void {
    this.rankingService.getPlayerStatistics(playerName).subscribe({
      next: (stats: PlayerStatistics) => {
        this.playerStatistics = stats
      },
      error: (error: any) => {
        console.error("Erro ao carregar estatísticas do jogador:", error)
        alert("Erro ao carregar estatísticas do jogador")
        this.playerStatistics = null
      },
    })
  }

  closePlayerStatistics(): void {
    this.playerStatistics = null
  }
}
