import { Action } from './constants';

export const enum Errors {
  NOT_FOUND = 'Entity was not found',
  NO_PLAYER = 'Requested player was not found',
  NO_ROOM = 'Requested room was not found',
  INVALID_AUTH_CREDENTIALS = 'Username or password is invalid',
  INVALID_ADD_PLAYER_ACTION = 'Unable to add player to room',
  DEFAULT_MESSAGE = 'Server error',
}

export class AppError extends Error {
  public readonly action: string;
  public readonly status: string;

  constructor(action: Action, status: string, message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.status = status;
    this.action = action;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = Errors.NOT_FOUND) {
    super(Action.ERROR, 'NOT_FOUND', message);
  }
}

export class NoPlayerError extends AppError {
  constructor(message: string = Errors.NO_PLAYER) {
    super(Action.PLAYER_AUTH, 'NO_PLAYER', message);
  }
}

export class NoRoomError extends AppError {
  constructor(message: string = Errors.NO_ROOM) {
    super(Action.ADD_PLAYER_TO_ROOM, 'NO_ROOM', message);
  }
}

export class AddPlayerToRoomError extends AppError {
  constructor(message: string = Errors.INVALID_ADD_PLAYER_ACTION) {
    super(Action.ADD_PLAYER_TO_ROOM, 'INVALID_ADD_PLAYER_ACTION', message);
  }
}

export class PlayerAuthError extends AppError {
  constructor(message: string = Errors.INVALID_ADD_PLAYER_ACTION) {
    super(Action.PLAYER_AUTH, 'INVALID_AUTH_CREDENTIALS', message);
  }
}
