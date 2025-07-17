import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Player {
  id?: string; // Guid na API .NET Core
  playerName: string;
  points: number;
  createdAt?: string;
}
@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  private apiUrl = 'https://localhost:44339/api/Score'; // URL da sua API .NET Core

  private mockPlayers: Player[] = [
    { id: '1', playerName: 'Yan Stassi', points: 100 },
    { id: '2', playerName: 'Beatriz Zuim', points: 90 },
    { id: '3', playerName: 'Luis Gustavo', points: 80 },
    { id: '4', playerName: 'Rodrigo Almeida', points: 70 },
    { id: '5', playerName: 'Leonardo Galera', points: 60 }
  ];

 constructor(private http: HttpClient) {}

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('API não disponível, usando dados mock:', error);
        return of(this.mockPlayers);
      })
    );
  }

  addPlayer(playerName: string, points: number = 0): Observable<Player> {
    return this.http.post<Player>(this.apiUrl, { playerName, points }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('API não disponível, simulando adição:', error);
        const newPlayer: Player = {
          id: crypto.randomUUID(),
          playerName,
          points,
          createdAt: new Date().toISOString()
        };
        this.mockPlayers.push(newPlayer);
        return of(newPlayer);
      })
    );
  }

  removePlayer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('API não disponível, simulando remoção:', error);
        const index = this.mockPlayers.findIndex(p => p.id === id);
        if (index > -1) {
          this.mockPlayers.splice(index, 1);
        }
        return of(void 0);
      })
    );
  }
}