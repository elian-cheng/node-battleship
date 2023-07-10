export interface IGameState {
  roomId: number;
  roomUsers: {
    name: string;
    index: number;
  }[];
}

export interface IRoom {
  indexRoom: number;
}

export interface IShip {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  type: 'small' | 'medium' | 'large' | 'huge';
  length: number;
}

export interface IShips {
  gameId: number;
  ships: IShip[];
}

export interface IPosition {
  x: number;
  y: number;
}

export interface IAttack {
  gameId: number;
  indexPlayer: number;
  x: number;
  y: number;
}

export interface IRandomAttack {
  gameId: number;
  indexPlayer: number;
}
