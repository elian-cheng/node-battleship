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

export const enum Attack {
  MISSED = 'miss',
  KILLED = 'killed',
  SHOT = 'shot',
  ERROR = 'error',
}

export const enum Square {
  EMPTY = 0,
  ERROR = 1,
  OCCUPIED = 2,
  SHOT = 3,
  KILLED = 4,
}

export interface IPosition {
  x: number;
  y: number;
}
