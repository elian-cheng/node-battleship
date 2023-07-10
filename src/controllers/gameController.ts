import { IGameState, IShip } from '../interfaces/game';
import { IWebSocket } from '../interfaces/common';
import Game from '../models/game';
import Player from '../models/player';
import Board from '../models/board';
import { NotFoundError } from '../common/errors';
import { Attack } from '../common/constants';

export default class GameController {
  private games: Game[];
  private lastGameId: number;

  constructor() {
    this.games = [];
    this.lastGameId = 1;
  }

  public createGame(player: Player): number {
    const gameId = this.createGameId();
    this.games.push(new Game(gameId, player));
    this.createBlankBoard(gameId, player.playerId);
    return gameId;
  }

  public addPlayerToGame(gameId: number, player: Player) {
    this.findGame(gameId).players.push(player);
    this.createBlankBoard(gameId, player.playerId);
    return gameId;
  }

  private createBlankBoard(gameId: number, playerId: number) {
    this.findGame(gameId).battlefield.set(playerId, new Board());
  }

  public addShips(gameId: number, playerId: number, ships: IShip[]) {
    this.findGame(gameId).battlefield.get(playerId)?.addShips(ships);
  }

  public canStart(gameId: number): boolean {
    return (
      Array.from(this.findGame(gameId).battlefield.values()).reduce((acc, board) => {
        return acc + Number(board.canStart);
      }, 0) === 2
    );
  }

  public getGamesState(): IGameState[] {
    return this.games.map((game) => game.getState());
  }

  public findGame(gameId: number): Game {
    const game = this.games.find((game) => game.gameId === gameId) || null;
    if (game === null) {
      throw new NotFoundError();
    }

    return game;
  }

  public deleteGame(gameId: number): void {
    this.games = this.games.filter((game) => game.gameId !== gameId);
  }

  private createGameId(): number {
    return this.lastGameId++;
  }

  public validatePlayerMove(gameId: number, playerId: number) {
    return this.findGame(gameId).currentPlayerIdx === playerId;
  }

  public attack(gameId: number, attackerPlayerId: number, positionX: number, positionY: number) {
    const game = this.findGame(gameId);
    const defenderPlayerId = game.getOpponent(attackerPlayerId);
    const status =
      game.battlefield.get(defenderPlayerId)?.attack(positionX, positionY) || Attack.ERROR;
    if (status === Attack.MISSED) {
      game.toggleCurrentPlayer();
    }
    return {
      nextPlayerId: game.currentPlayerIdx,
      status,
    };
  }

  public isGameOver(gameId: number) {
    const game = this.findGame(gameId);
    const { battlefield } = game;
    for (const [playerId, board] of battlefield.entries()) {
      if (board.isGameOver()) {
        game.setWinnerLoser(playerId);
        return true;
      }
    }
    return false;
  }

  public getWSByGameId(gameId: number): IWebSocket[] {
    return this.findGame(gameId).players.map((player) => player.ws);
  }

  public getRandomAttack(gameId: number) {
    const game = this.findGame(gameId);
    const opponentId = game.getOpponent(game.currentPlayerIdx);
    return game.battlefield.get(opponentId)?.getRandomAttackPositions() || { x: -1, y: -1 };
  }
}
