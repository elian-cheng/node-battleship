import WebSocket, { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
import ActionController from './controllers/actionController';
import { IMessage, IWebSocket } from './interfaces/common';
import { Action } from './common/constants';
import { AppError, Errors } from './common/errors';
interface IAppProps {
  actionController: ActionController;
}

export default class App {
  private wsServer!: WebSocket.Server;
  private controller: ActionController;

  constructor({ actionController }: IAppProps) {
    this.controller = actionController;
  }

  private start(port: number) {
    this.wsServer = new WebSocketServer({ port });
    this.controller.initWSServer(this.wsServer);
  }

  private parseActionMessage(payload: string) {
    const message = JSON.parse(payload.toString()) as IMessage;
    const { type, id } = message;
    const data = message.data.trim().length > 0 ? JSON.parse(message.data) : {};
    return {
      type,
      data,
      id,
    };
  }

  public listen(port: number) {
    this.start(port);
    this.wsServer.on('connection', (ws: IWebSocket): void => {
      ws.socketId = randomUUID();
      ws.on('error', console.error);
      ws.on('message', (payload: WebSocket.RawData): void => {
        const { type, data } = this.parseActionMessage(payload.toString());
        console.log('Action type: %s', type);
        console.log('Data:', JSON.stringify(data));

        try {
          switch (type) {
            case Action.PLAYER_AUTH: {
              this.controller.authorizePlayer(ws, data);
              this.controller.updateRoomsWinners();
              break;
            }
            case Action.CREATE_ROOM: {
              this.controller.createRoom(ws);
              this.controller.updateRoomsWinners();
              break;
            }
            case Action.ADD_PLAYER_TO_ROOM: {
              this.controller.addPlayerToRoom(ws, data);
              this.controller.updateRoomsWinners();
              break;
            }
            case Action.ADD_SHIPS: {
              this.controller.addShips(ws, data);
              break;
            }
            case Action.ATTACK: {
              this.controller.attack(ws, data);
              break;
            }
            case Action.RANDOM_ATTACK: {
              this.controller.randomAttack(ws, data);
              break;
            }
            default: {
              console.log('Action type does not exist');
              break;
            }
          }
        } catch (err) {
          this.handleErrors(ws, err);
        }
      });

      ws.on('close', () => {
        try {
          this.controller.removeConnection(ws);
        } catch (err) {
          this.handleErrors(ws, err);
        }
      });
    });
  }

  private sendErrorRes(ws: IWebSocket, Action: string, text: string) {
    ws.send(
      JSON.stringify({
        type: Action,
        data: JSON.stringify({
          error: true,
          errorText: text,
        }),
        id: 0,
      })
    );
  }

  private handleErrors(ws: IWebSocket, err: unknown) {
    if (err instanceof AppError) {
      this.sendErrorRes(ws, (err as AppError).action, (err as AppError).message);
    } else {
      this.sendErrorRes(ws, Action.ERROR, Errors.DEFAULT_MESSAGE);
    }
  }
}
