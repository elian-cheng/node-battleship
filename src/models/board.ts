import { Attack, Square } from '../common/constants';
import { IPosition, IShip } from '../interfaces/game';
import Ship from './ship';

export default class Board {
  private readonly shipsTotalQuantity = 10;
  private readonly battlefield: Square[][];
  private readonly activeShips: Ship[];
  private ships: IShip[];
  private killedShips: number;
  public canStart: boolean;

  constructor() {
    this.activeShips = [];
    this.ships = [];
    this.killedShips = 0;
    this.canStart = false;
    this.battlefield = [];
    for (let i = 0; i < 10; i++) {
      this.battlefield.push(Array(10).fill(Square.EMPTY));
    }
  }

  public getShips() {
    return this.ships;
  }

  addShips(ships: IShip[]): void {
    this.ships = ships;
    ships.forEach((shipData) => {
      this.activeShips.push(new Ship(shipData));
    });
    this.canStart = true;
  }

  public attack(x: number, y: number) {
    if (this.battlefield[x][y] !== Square.EMPTY) {
      return Attack.ERROR;
    }
    let attackStatus = Attack.MISSED;
    for (const ship of this.activeShips) {
      const result = ship.attack(x, y);
      if (result !== Attack.MISSED) {
        attackStatus = result;
        this.killedShips += result === Attack.KILLED ? 1 : 0;
        break;
      }
    }
    this.battlefield[x][y] = Square.ERROR;
    return attackStatus;
  }

  public isGameOver() {
    return this.killedShips === this.shipsTotalQuantity;
  }

  public getRandomAttackPositions() {
    const positions: IPosition[] = [];
    for (let y = 0; y < this.battlefield.length; y++) {
      for (let x = 0; x < this.battlefield.length; x++) {
        if (this.battlefield[x][y] !== Square.ERROR) {
          positions.push({ x, y });
        }
      }
    }
    if (positions.length === 0) {
      return { x: -1, y: -1 };
    }
    return positions[Math.floor(Math.random() * (positions.length + 1))];
  }
}
