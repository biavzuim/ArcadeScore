import { Component, OnInit } from "@angular/core";
import { PlayersService, Player } from "../players.service";
import { RankingService, PlayerStatistics } from "../ranking.service";
import { ToastrService } from 'ngx-toastr'; // ✅ IMPORTADO AQUI

@Component({
  selector: "app-players",
  templateUrl: "./players.component.html",
  styleUrls: ["./players.component.css"],
})
export class PlayersComponent implements OnInit {
  players: Player[] = [];
  selectedPlayer: Player | null = null;
  totalScore = 0;
  newPlayerName = "";
  playerStatistics: PlayerStatistics | null = null;

  constructor(
    private readonly playersService: PlayersService,
  private readonly rankingService: RankingService,
  private readonly toastr: ToastrService

  ) {}

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.playersService.getPlayers().subscribe({
      next: (players: Player[]) => {
        this.players = players;
      },
      error: (error: any) => {
        console.error("Erro ao carregar jogadores:", error);
        this.toastr.error("Erro ao carregar jogadores", "Erro");
      },
    });
  }

  selectPlayer(player: Player): void {
    this.selectedPlayer = player;
    this.totalScore = 0;
    this.playerStatistics = null;

    if (player.playerName) {
      this.rankingService.getTotalScoreByPlayer(player.playerName).subscribe({
        next: (total: number) => {
          this.totalScore = total;
        },
        error: (error: any) => {
          console.error("Erro ao carregar pontuação total:", error);
          this.toastr.error("Erro ao carregar pontuação total", "Erro");
          this.totalScore = 0;
        },
      });
    }
  }

  addPlayer(): void {
    const trimmedName = this.newPlayerName.trim();
    if (trimmedName) {
      this.playersService.addPlayer(trimmedName).subscribe({
        next: (newPlayer: Player) => {
          this.players.push(newPlayer); // atualiza localmente
          this.newPlayerName = "";
          this.toastr.success("Jogador adicionado com sucesso!", "Sucesso");
        },
        error: (error: any) => {
          console.error("Erro ao adicionar jogador:", error);
          this.toastr.error("Erro ao adicionar jogador", "Erro");
        },
      });
    } else {
      this.toastr.warning("Digite um nome válido para o jogador.", "Atenção");
    }
  }

  viewPlayerStatistics(playerName: string): void {
    this.rankingService.getPlayerStatistics(playerName).subscribe({
      next: (stats: PlayerStatistics) => {
        this.playerStatistics = stats;
      },
      error: (error: any) => {
        console.error("Erro ao carregar estatísticas do jogador:", error);
        this.toastr.error("Erro ao carregar estatísticas do jogador", "Erro");
        this.playerStatistics = null;
      },
    });
  }

  closePlayerStatistics(): void {
    this.playerStatistics = null;
  }
}
