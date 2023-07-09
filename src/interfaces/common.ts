import Action from '../common/action';
import WebSocket from 'ws';

export interface IMessage {
  type: Action;
  data: string;
  id: number;
}

export interface IWebSocket extends WebSocket {
  socketId: string;
  gameId: number;
  playerId: number;
}

