import WebSocket, { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
import ActionController from './actionController';
import { IMessage, IWebSocket } from './interfaces/common';
import Action from './common/action';
import { AppError, Errors } from './common/errors';

interface IAppConstructorProps {
  actionController: ActionController;
}

export default class App {
  private wsServer!: WebSocket.Server;
  private controller: ActionController;

  constructor({ actionController }: IAppConstructorProps) {
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