import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { FormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { RegisterScoreComponent } from "./register-score/register-score.component"
import { PlayersComponent } from "./players/players.component"
import { RankingComponent } from "./ranking/ranking.component"

@NgModule({
  declarations: [AppComponent, RegisterScoreComponent, PlayersComponent, RankingComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
