import { IGameState } from '../interfaces/game';
import Player from './player';

export default class Game {
  private currentPlayerId: number;
  public gameId: number;
  public players: Player[];
  public winPlayerId: number;

  constructor(gameId: number, player: Player) {
    this.gameId = gameId;
    this.players = [player];
    this.currentPlayerId = player.playerId;
    this.winPlayerId = player.playerId;
  }

  public get currentPlayerIdx(): number {
    return this.currentPlayerId;
  }

  public toggleCurrentPlayerId(): void {
    this.currentPlayerId = this.getOpponentId(this.currentPlayerId);
  }

  public setLoserPlayerId(loserId: number): void {
    if (this.players.length === 2) {
      const winPlayer = this.players[0].playerId === loserId ? this.players[1] : this.players[0];
      winPlayer.wins += 1;
      this.winPlayerId = winPlayer.playerId;
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

  public getOpponentId(currentPlayerId: number) {
    return this.players[0].playerId === currentPlayerId
      ? this.players[1].playerId
      : this.players[0].playerId;
  }
}
