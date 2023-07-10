const enum Action {
  PLAYER_AUTH = 'reg',
  CREATE_GAME = 'create_game',
  START_GAME = 'start_game',
  PLAYER_TURN = 'turn',
  ATTACK = 'attack',
  FINISH = 'finish',
  CREATE_ROOM = 'create_room',
  UPDATE_ROOM = 'update_room',
  UPDATE_WINNERS = 'update_winners',
  ADD_PLAYER_TO_ROOM = 'add_user_to_room',
  ADD_SHIPS = 'add_ships',
  RANDOM_ATTACK = 'randomAttack',
  ERROR = 'server_error',
}

export default Action;
