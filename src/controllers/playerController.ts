import Player from '../models/player';
import { NoPlayerError, PlayerAuthError } from '../common/errors';
import { validatePlayerAuth } from '../common/validation';
import { IWebSocket } from '../interfaces/common';
import { IPlayerWins } from '../interfaces/player';

export default class PlayerController {
  private readonly players: Player[];

  constructor() {
    this.players = [];
  }

  public authorizePlayer(ws: IWebSocket, name: string, password: string): Player {
    if (!validatePlayerAuth(name, password)) {
      throw new PlayerAuthError();
    }
    let player = this.findExistingPlayer(name, password);
    if (player === null) {
      player = new Player(this.createPlayerId(), ws, name, password);
      this.players.push(player);
    }
    return player;
  }

  public getPlayerById(playerId: number): Player {
    const player = this.players.find((player) => player && player.playerId === playerId) || null;
    if (player === null) {
      throw new NoPlayerError();
    }
    return player;
  }

  public getWinners(): IPlayerWins[] {
    return this.players.map((player) => {
      return {
        name: player.name,
        wins: player.wins,
      };
    });
  }

  private findExistingPlayer(name: string, password: string): Player | null {
    return (
      this.players.find(
        (player) => player && player.name === name && player.password === password
      ) || null
    );
  }

  private createPlayerId(): number {
    return this.players.length + 1;
  }
}
