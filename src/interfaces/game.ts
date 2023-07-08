export interface IGameState {
  roomId: number;
  roomUsers: {
    name: string;
    index: number;
  }[];
}

export interface IShip {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  type: string;
  length: number;
}

export const enum Attack {
  MISSED = 'miss',
  KILLED = 'killed',
  SHOT = 'shot',
  ERROR = 'error',
}
