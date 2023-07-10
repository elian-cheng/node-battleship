import { IGameState } from '../interfaces/game';
import Board from './board';
import Player from './player';

export default class Game {
  private currentPlayer: number;
  public gameId: number;
  public players: Player[];
  public winner: number;
  public battlefield: Map<number, Board>;

  constructor(gameId: number, player: Player) {
    this.gameId = gameId;
    this.players = [player];
    this.currentPlayer = player.playerId;
    this.winner = player.playerId;
    this.battlefield = new Map();
  }

  public get currentPlayerIdx(): number {
    return this.currentPlayer;
  }

  public toggleCurrentPlayer(): void {
    this.currentPlayer = this.getOpponent(this.currentPlayer);
  }

  public setWinnerLoser(loserId: number): void {
    if (this.players.length === 2) {
      const winner = this.players[0].playerId === loserId ? this.players[1] : this.players[0];
      winner.wins += 1;
      this.winner = winner.playerId;
    }
  }

  public getTotalPlayersQuantity() {
    return this.players.length;
  }

  public getState(): IGameState {
    return {
      roomId: this.gameId,
      roomUsers: this.players.map((player) => {
        return {
          name: player.name,
          index: player.playerId,
        };
      }),
    };
  }

  public getOpponent(currentPlayerId: number) {
    return this.players[0].playerId === currentPlayerId
      ? this.players[1].playerId
      : this.players[0].playerId;
  }
}
