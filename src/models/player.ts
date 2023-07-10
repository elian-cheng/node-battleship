import { IWebSocket } from '../interfaces/common';

export default class Player {
  public ws: IWebSocket;
  public playerId: number;
  public socketId: string;
  public name: string;
  public password: string;
  public wins: number;
  public isBot: boolean;

  constructor(playerId: number, ws: IWebSocket, name: string, password: string) {
    this.ws = ws;
    this.playerId = playerId;
    this.socketId = ws.socketId;
    this.name = name;
    this.password = password;
    this.wins = 0;
    this.isBot = false;
  }
}
