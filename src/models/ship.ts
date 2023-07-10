import { Attack } from '../common/constants';
import { IShip } from '../interfaces/game';

export default class Ship {
  positionX: number[];
  positionY: number[];
  length: number;
  shotsCount: number;

  constructor(ship: IShip) {
    const { length, direction } = ship;
    const { x, y } = ship.position;
    if (direction) {
      this.positionX = [x];
      this.positionY = Array(length)
        .fill(0)
        .map((value, index) => value + index + y);
    } else {
      this.positionY = [y];
      this.positionX = Array(length)
        .fill(0)
        .map((value, index) => value + index + x);
    }
    this.length = length;
    this.shotsCount = 0;
  }

  public attack(x: number, y: number): Attack {
    if (this.positionX.includes(x) && this.positionY.includes(y)) {
      this.shotsCount += 1;
      return this.length === this.shotsCount ? Attack.KILLED : Attack.SHOT;
    }
    return Attack.MISSED;
  }
}
