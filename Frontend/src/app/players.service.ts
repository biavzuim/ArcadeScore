import { Injectable } from "@angular/core"
import  { HttpClient, HttpErrorResponse } from "@angular/common/http"
import {  Observable, of } from "rxjs"
import { catchError, map } from "rxjs/operators"

export interface Player {
  playerName: string
}

interface BackendScore {
  id: number, 
  playerName: string
  points: number
  createdAt: string
}

@Injectable({
  providedIn: "root",
})
export class PlayersService {
  private apiUrl = "https://localhost:7286/api/Score"

  private mockPlayers: Player[] = [
    { playerName: "Yan Stassi" },
    { playerName: "Beatriz Zuim" },
    { playerName: "Luis Gustavo" },
    { playerName: "Rodrigo Almeida" },
    { playerName: "Leonardo Galera" },
  ]

  constructor(public http: HttpClient) {}

  getPlayers(): Observable<Player[]> {
    return this.http.get<BackendScore[]>(this.apiUrl).pipe(
      map((scores) => {
        const uniquePlayerNames = Array.from(new Set(scores.map((s) => s.playerName)))
        return uniquePlayerNames.map((name) => ({ playerName: name }))
      }),
      catchError((error: HttpErrorResponse) => {
        console.warn("API not available to players, using mock data:", error)
        return of(this.mockPlayers)
      }),
    )
  }

  addPlayer(playerName: string): Observable<Player> {
    const scoreDto = { playerName: playerName, points: 0 } // Adiciona com 0 pontos
    return this.http.post<BackendScore>(this.apiUrl, scoreDto).pipe(
      map((backendScore) => ({ playerName: backendScore.playerName })),
      catchError((error: HttpErrorResponse) => {
        console.warn("API not available, simulating player addition:", error)
        const newPlayer: Player = { playerName }
        if (!this.mockPlayers.some((p) => p.playerName === newPlayer.playerName)) {
          this.mockPlayers.push(newPlayer)
        }
        return of(newPlayer)
      }),
    )
  }


  removePlayer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn("API not available, simulating punctuation removal:", error)
        return of(void 0)
      }),
    )
  }
}
