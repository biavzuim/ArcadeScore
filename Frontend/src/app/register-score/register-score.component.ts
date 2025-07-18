import { Component, type OnInit } from "@angular/core" // Importe Component e OnInit
import  { PlayersService, Player } from "../players.service"
import  { RankingService } from "../ranking.service"

@Component({
  // Certifique-se de que o decorator @Component está aqui
  selector: "app-register-score",
  templateUrl: "./register-score.component.html",
  styleUrls: ["./register-score.component.css"],
})
export class RegisterScoreComponent implements OnInit {
  players: Player[] = []

  newScore = {
    playerName: null as string | null,
    date: "",
    score: null as number | null,
  }

  constructor(
    private playersService: PlayersService,
    private rankingService: RankingService,
  ) {}

  ngOnInit() {
    this.loadPlayers()
  }

  loadPlayers(): void {
    this.playersService.getPlayers().subscribe({
      next: (players) => {
        this.players = players
      },
      error: (error) => {
        console.error("Erro ao carregar jogadores:", error)
        alert("Erro ao carregar jogadores")
      },
    })
  }

  save() {
    if (this.newScore.playerName && this.newScore.date && this.newScore.score != null) {
      this.rankingService.addScore(this.newScore.playerName, this.newScore.date, this.newScore.score).subscribe({
        next: (result) => {
          this.newScore = { playerName: null, date: "", score: null }
          alert("Pontuação registrada com sucesso!")
        },
        error: (error) => {
          console.error("Erro ao registrar pontuação:", error)
          alert("Erro ao registrar pontuação")
        },
      })
    } else {
      alert("Preencha todos os campos corretamente.")
    }
  }
}
