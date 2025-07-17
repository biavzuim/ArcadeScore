import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ScoreRecord {
  id?: number;
  playerId: number;
  playerName?: string;
  date: string;
  score: number;
}

export interface PlayerRanking {
  playerId: number;
  playerName: string;
  totalScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private apiUrl = 'https://localhost:7000/api/scores';
  
  // Dados mock para fallback
  private mockScores: ScoreRecord[] = [
    { id: 1, playerId: 1, playerName: 'Yan Stassi', date: '2024-01-15', score: 1500 },
    { id: 2, playerId: 2, playerName: 'Beatriz Zuim', date: '2024-01-16', score: 1200 },
    { id: 3, playerId: 1, playerName: 'Yan Stassi', date: '2024-01-17', score: 800 }
  ];

  constructor(private http: HttpClient) {}

  getScores(): Observable<ScoreRecord[]> {
    return this.http.get<ScoreRecord[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('API não disponível, usando dados mock:', error);
        return of(this.mockScores);
      })
    );
  }

  addScore(playerId: number, date: string, score: number): Observable<ScoreRecord> {
    return this.http.post<ScoreRecord>(this.apiUrl, { playerId, date, score }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('API não disponível, simulando adição de score:', error);
        const newScore: ScoreRecord = {
          id: Math.max(...this.mockScores.map(s => s.id || 0)) + 1,
          playerId,
          date,
          score,
          playerName: `Player ${playerId}`
        };
        this.mockScores.push(newScore);
        return of(newScore);
      })
    );
  }

  getRanking(): Observable<PlayerRanking[]> {
    return this.http.get<PlayerRanking[]>(`${this.apiUrl}/ranking`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('API não disponível, calculando ranking dos dados mock:', error);
        return this.calculateRankingFromScores();
      })
    );
  }

  getTotalScoreByPlayer(playerId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/player/${playerId}/total`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('API não disponível, calculando total dos dados mock:', error);
        const total = this.mockScores
          .filter(score => score.playerId === playerId)
          .reduce((sum, score) => sum + score.score, 0);
        return of(total);
      })
    );
  }

  private calculateRankingFromScores(): Observable<PlayerRanking[]> {
    const totals: { [playerId: number]: { name: string, total: number } } = {};
    
    for (const score of this.mockScores) {
      if (!totals[score.playerId]) {
        totals[score.playerId] = {
          name: score.playerName || `Player ${score.playerId}`,
          total: 0
        };
      }
      totals[score.playerId].total += score.score;
    }

    const ranking: PlayerRanking[] = Object.entries(totals)
      .map(([playerId, data]) => ({
        playerId: Number(playerId),
        playerName: data.name,
        totalScore: data.total
      }))
      .sort((a, b) => b.totalScore - a.totalScore);

    return of(ranking);
  }
}
