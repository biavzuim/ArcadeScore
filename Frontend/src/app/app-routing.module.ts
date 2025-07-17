import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayersComponent } from './players/players.component';
import { RankingComponent } from './ranking/ranking.component';
import { RegisterScoreComponent } from './register-score/register-score.component';

const routes: Routes = [
  { path: 'players', component: PlayersComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'register-score', component: RegisterScoreComponent },
  { path: '', redirectTo: '/players', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
