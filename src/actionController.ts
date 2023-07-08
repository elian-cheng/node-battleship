import Action from 'common/action';
import { IWebSocket } from 'interfaces/common';
import WebSocket from 'ws';

export default class ActionController {
  private wsServer!: WebSocket.Server;

  public initWSServer(wsServer: WebSocket.Server) {
    this.wsServer = wsServer;
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
