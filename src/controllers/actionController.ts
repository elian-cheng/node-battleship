import Action from '../common/action';
import { IWebSocket } from '../interfaces/common';
import { IPlayerAuth } from '../interfaces/player';
import WebSocket from 'ws';
import PlayerController from './playerController';
import GameController from './gameController';

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

  private createResponse(type: Action, data: object): string {
    return JSON.stringify({
      type,
      data: JSON.stringify(data),
    });
  }

  public removeConnection(ws: IWebSocket) {
    console.log(`Connection removed for: ${ws.socketId}`);
  }
}
