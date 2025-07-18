import  { HttpClient, HttpErrorResponse } from "@angular/common/http"
import {  Observable, of } from "rxjs"
import { catchError } from "rxjs/operators"
import { Injectable } from "@angular/core"

export interface ScoreRecord {
  playerName: string
  points: number
  date?: string
}

export interface PlayerRanking {
  playerName: string
  totalScore: number
}

export interface PlayerStatistics {
  playerName: string
  gamesPlayed: number
  averageScore: number
  highestScore: number
  lowestScore: number
  recordBrokenCount: number
  timePlaying: string
}

@Injectable({
  providedIn: "root",
})
export class RankingService {
  private apiUrl = "https://localhost:7286/api/Score"

  private mockScores: ScoreRecord[] = [
    { playerName: "Yan Stassi", points: 1500, date: "2024-01-15" },
    { playerName: "Beatriz Zuim", points: 1200, date: "2024-01-16" },
    { playerName: "Yan Stassi", points: 800, date: "2024-01-17" },
  ]

  constructor(private http: HttpClient) {}

  getScores(): Observable<ScoreRecord[]> {
    return this.http.get<ScoreRecord[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn("API não disponível, usando dados mock para getScores:", error)
        return of(this.mockScores)
      }),
    )
  }

  addScore(playerName: string, date: string, score: number): Observable<any> {
    const scoreDto = { playerName: playerName, points: score }
    return this.http.post<any>(this.apiUrl, scoreDto).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn("API não disponível, simulando adição de score:", error)
        const newMockScore: ScoreRecord = {
          playerName,
          points: score,
          date,
        }
        this.mockScores.push(newMockScore)
        return of(newMockScore)
      }),
    )
  }

  getRanking(): Observable<PlayerRanking[]> {
    return this.http.get<PlayerRanking[]>(`${this.apiUrl}/ranking`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn("API não disponível, calculando ranking dos dados mock:", error)
        return this.calculateRankingFromScores()
      }),
    )
  }

  getTotalScoreByPlayer(playerName: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/player/${playerName}/total`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn("API não disponível, calculando total dos dados mock:", error)
        const total = this.mockScores
          .filter((score) => score.playerName === playerName)
          .reduce((sum, score) => sum + score.points, 0)
        return of(total)
      }),
    )
  }

  getPlayerStatistics(playerName: string): Observable<PlayerStatistics> {
    return this.http.get<PlayerStatistics>(`${this.apiUrl}/player/${playerName}/statistics`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn("API não disponível, simulando estatísticas do jogador:", error)
        // Implementar cálculo de estatísticas mock se necessário para fallback
        return of({
          playerName,
          gamesPlayed: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          recordBrokenCount: 0,
          timePlaying: "0 dias",
        })
      }),
    )
  }

  private calculateRankingFromScores(): Observable<PlayerRanking[]> {
    const totals: { [playerName: string]: { total: number } } = {}

    for (const score of this.mockScores) {
      if (!totals[score.playerName]) {
        totals[score.playerName] = { total: 0 }
      }
      totals[score.playerName].total += score.points
    }

    const ranking: PlayerRanking[] = Object.entries(totals)
      .map(([playerName, data]) => ({
        playerName: playerName,
        totalScore: data.total,
      }))
      .sort((a, b) => b.totalScore - a.totalScore)

    return of(ranking)
  }
}
