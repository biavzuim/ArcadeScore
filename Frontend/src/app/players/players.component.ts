import { Component, OnInit } from '@angular/core';
import { PlayersService, Player } from '../players.service';
import { RankingService } from '../ranking.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {
  players: Player[] = [];
  selectedPlayer: Player | null = null;
  totalScore: number = 0;
  newPlayerName: string = '';
  confirmingPlayer: Player | null = null;

  constructor(
    private playersService: PlayersService,
    private rankingService: RankingService
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
        console.error('Erro ao carregar jogadores:', error);
        alert('Erro ao carregar jogadores');
      }
    });
  }

  selectPlayer(player: Player): void {
    this.selectedPlayer = player;
    if (player.id) {
      this.rankingService.getTotalScoreByPlayer(Number(player.id)).subscribe({
        next: (total: number) => {
          this.totalScore = total;
        },
        error: (error: any) => {
          console.error('Erro ao carregar pontuação:', error);
          this.totalScore = 0;
        }
      });
    }
  }

  addPlayer(): void {
    const trimmedName = this.newPlayerName.trim();
    if (trimmedName) {
      this.playersService.addPlayer(trimmedName).subscribe({
        next: (newPlayer: Player) => {
          this.newPlayerName = '';
          this.loadPlayers();
        },
        error: (error: any) => {
          console.error('Erro ao adicionar jogador:', error);
          alert('Erro ao adicionar jogador');
        }
      });
    }
  }

  removePlayer(player: Player): void {
    if (player.id) {
      this.playersService.removePlayer(player.id).subscribe({
        next: () => {
          if (this.selectedPlayer?.id === player.id) {
            this.selectedPlayer = null;
            this.totalScore = 0;
          }
          this.loadPlayers();
        },
        error: (error: any) => {
          console.error('Erro ao remover jogador:', error);
          alert('Erro ao remover jogador');
        }
      });
    }
  }

  confirmRemove(player: Player): void {
    this.confirmingPlayer = player;
  }

  cancelRemove(): void {
    this.confirmingPlayer = null;
  }

  confirmAndRemove(): void {
    if (this.confirmingPlayer) {
      this.removePlayer(this.confirmingPlayer);
      this.confirmingPlayer = null;
    }
  }
}