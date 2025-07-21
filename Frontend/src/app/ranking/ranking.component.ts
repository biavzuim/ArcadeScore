import { Component, OnInit } from "@angular/core";
import { RankingService, PlayerRanking } from "../ranking.service";
import { ToastrService } from 'ngx-toastr'; // import toastr

@Component({
  selector: "app-ranking",
  templateUrl: "./ranking.component.html",
  styleUrls: ["./ranking.component.css"],
})
export class RankingComponent implements OnInit {
  rankingList: PlayerRanking[] = [];

  constructor(
    private readonly rankingService: RankingService,
    private readonly toastr: ToastrService // injetado com readonly
  ) {}

  ngOnInit() {
    this.loadRanking();
  }

  loadRanking() {
    this.rankingService.getRanking().subscribe({
      next: (ranking) => {
        this.rankingList = ranking;
      },
      error: (error) => {
        console.error("Error loading ranking:", error);
        this.toastr.error("Error loading ranking", "Error");
      },
    });
  }
}
