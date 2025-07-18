import { Component, OnInit } from "@angular/core" // Importe Component e OnInit
import  { RankingService, PlayerRanking } from "../ranking.service"

@Component({
  // Certifique-se de que o decorator @Component está aqui
  selector: "app-ranking",
  templateUrl: "./ranking.component.html",
  styleUrls: ["./ranking.component.css"],
})
export class RankingComponent implements OnInit {
  rankingList: PlayerRanking[] = []

  constructor(private rankingService: RankingService) {}

  ngOnInit() {
    this.loadRanking()
  }

  loadRanking() {
    this.rankingService.getRanking().subscribe({
      next: (ranking) => {
        this.rankingList = ranking
      },
      error: (error) => {
        console.error("Erro ao carregar ranking:", error)
        alert("Erro ao carregar ranking")
      },
    })
  }
}
