import { Component, type OnInit } from "@angular/core";
import { PlayersService, Player } from "../players.service";
import { RankingService } from "../ranking.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-register-score",
  templateUrl: "./register-score.component.html",
  styleUrls: ["./register-score.component.css"],
})
export class RegisterScoreComponent implements OnInit {
  players: Player[] = [];

  newScore = {
    playerName: null as string | null,
    date: "",
    score: null as number | null,
  };

  constructor(
    private readonly playersService: PlayersService,
    private readonly rankingService: RankingService,
    private readonly toastr: ToastrService // ✅ agora com readonly também
  ) {}

  ngOnInit() {
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.playersService.getPlayers().subscribe({
      next: (players) => {
        this.players = players;
      },
      error: (error) => {
        console.error("Error loading players:", error);
        this.toastr.error("Error loading players", "Error");
      },
    });
  }

  save() {
    if (this.newScore.playerName && this.newScore.date && this.newScore.score != null) {
      this.rankingService.addScore(this.newScore.playerName, this.newScore.date, this.newScore.score).subscribe({
        next: () => {
          this.newScore = { playerName: null, date: "", score: null };
          this.toastr.success("Score recorded successfully!", "Success");
        },
        error: (error) => {
          console.error("Error registering score:", error);
          this.toastr.error("Error recording score", "Error");
        },
      });
    } else {
      this.toastr.warning("Please fill in all fields correctly.", "Attention");
    }
  }
}
