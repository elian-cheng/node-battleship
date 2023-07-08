export interface IGameState {
  roomId: number;
  roomUsers: {
    name: string;
    index: number;
  }[];
}
