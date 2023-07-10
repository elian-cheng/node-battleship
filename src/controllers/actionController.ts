import { Action, Attack } from '../common/constants';
import { IWebSocket } from '../interfaces/common';
import { IPlayerAuth } from '../interfaces/player';
import WebSocket from 'ws';
import PlayerController from './playerController';
import GameController from './gameController';
import { AddPlayerToRoomError } from '../common/errors';
import { IAttack, IRandomAttack, IRoom, IShips } from '../interfaces/game';

interface IActionControllerProps {
  playerController: PlayerController;
  gameController: GameController;
}

export default class ActionController {
  private wsServer!: WebSocket.Server;
  private playerController: PlayerController;
  private gameController: GameController;

  constructor({ playerController, gameController }: IActionControllerProps) {
    this.playerController = playerController;
    this.gameController = gameController;
  }

  public initWSServer(wsServer: WebSocket.Server) {
    this.wsServer = wsServer;
  }

  public authorizePlayer(ws: IWebSocket, { name, password }: IPlayerAuth) {
    const { playerId, name: playerName } = this.playerController.authorizePlayer(
      ws,
      name,
      password
    );
    ws.playerId = playerId;
    ws.gameId = 0;
    const response = this.createResponse(Action.PLAYER_AUTH, {
      name: playerName,
      index: playerId,
      error: false,
      errorText: '',
    });
    ws.send(response);
  }

  public createRoom(ws: IWebSocket) {
    const player = this.playerController.getPlayerById(ws.playerId);
    ws.gameId = this.gameController.createGame(player);
    const response = this.createResponse(Action.CREATE_GAME, {
      idGame: ws.gameId,
      idPlayer: ws.playerId,
    });
    ws.send(response);
  }

  public addPlayerToRoom(ws: IWebSocket, data: IRoom) {
    const gameId = data.indexRoom;
    const { playerId } = ws;
    const game = this.gameController.findGame(gameId);
    if (game.getTotalPlayersQuantity() === 2) {
      throw new AddPlayerToRoomError();
    }
    const player = this.playerController.getPlayerById(playerId);
    this.gameController.addPlayerToGame(gameId, player);
    ws.gameId = gameId;
    const response = this.createResponse(Action.CREATE_GAME, {
      idGame: gameId,
      idPlayer: playerId,
    });
    ws.send(response);
  }

  public updateRoomsWinners(): void {
    this.responseForAll(
      this.createResponse(Action.UPDATE_WINNERS, [...this.playerController.getWinners()])
    );
    this.responseForAll(
      this.createResponse(Action.UPDATE_ROOM, [...this.gameController.getGamesState()])
    );
  }

  public addShips(ws: IWebSocket, data: IShips) {
    const { ships } = data;
    const { playerId, gameId } = ws;
    this.gameController.addShips(gameId, playerId, ships);
    if (this.gameController.canStart(gameId)) {
      this.startGame(gameId);
    }
  }

  public startGame(gameId: number) {
    const game = this.gameController.findGame(gameId);
    const { currentPlayerIdx, players, battlefield } = game;
    {
      const response = {
        type: Action.START_GAME,
        data: JSON.stringify({
          ships: battlefield.get(players[0].playerId)?.getShips() || [],
          currentPlayerIndex: currentPlayerIdx,
        }),
      };
      players[0].ws.send(JSON.stringify(response));
    }
    {
      const response = {
        type: Action.START_GAME,
        data: JSON.stringify({
          ships: battlefield.get(players[1].playerId)?.getShips() || [],
          currentPlayerIndex: currentPlayerIdx,
        }),
      };
      players[1].ws.send(JSON.stringify(response));
    }
  }

  public attack(ws: IWebSocket, data: IAttack): void {
    const { gameId, indexPlayer, x: positionX, y: positionY } = data;
    if (!this.gameController.validatePlayerMove(gameId, ws.playerId)) {
      return;
    }
    const { status, nextPlayerId } = this.gameController.attack(
      gameId,
      indexPlayer,
      positionX,
      positionY
    );
    if (status === Attack.ERROR) {
      return;
    }
    if (this.gameController.isGameOver(gameId)) {
      try {
        this.finishGameRes(gameId);
        this.gameController.deleteGame(gameId);
      } finally {
        this.updateRoomsWinners();
      }
      return;
    }

    const clients = this.gameController.getWSByGameId(gameId);

    let response = this.createResponse(Action.ATTACK, {
      position: {
        x: positionX,
        y: positionY,
      },
      currentPlayer: indexPlayer,
      status,
    });
    clients.forEach((ws) => {
      ws.send(response);
    });
    response = this.createResponse(Action.PLAYER_TURN, {
      currentPlayer: nextPlayerId,
    });
    clients.forEach((ws) => {
      ws.send(response);
    });
  }

  public randomAttack(ws: IWebSocket, data: IRandomAttack) {
    const { gameId, indexPlayer } = data;
    const { x, y } = this.gameController.getRandomAttack(gameId);
    if (x === -1 || y === -1) {
      return;
    }
    this.attack(ws, { gameId, x, y, indexPlayer });
  }

  public finishGameRes(gameId: number) {
    const game = this.gameController.findGame(gameId);
    game.players.forEach(({ ws }) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(this.createResponse(Action.FINISH, { winPlayer: game.winner }));
      }
    });
  }

  public responseForAll(response: string) {
    this.wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(response);
      }
    });
  }

  private createResponse(type: Action, data: object): string {
    return JSON.stringify({
      type,
      data: JSON.stringify(data),
    });
  }

  public removeConnection(ws: IWebSocket) {
    console.log(`Connection removed for: ${ws.socketId}`);
    const { gameId, playerId } = ws;
    if (gameId) {
      try {
        const game = this.gameController.findGame(gameId);
        if (game.getTotalPlayersQuantity() === 2) {
          game.setWinnerLoser(playerId);
          this.finishGameRes(gameId);
        }
        this.gameController.deleteGame(gameId);
      } finally {
        this.updateRoomsWinners();
      }
    }
  }
}
