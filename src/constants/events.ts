export enum Events {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  VALIDATE_USERNAME = 'validate-username',
  VALIDATE_USERNAME_FAIL = 'validate-username-fail',
  VALIDATE_USERNAME_SUCCESS = 'validate-username-success',
  INITIAL_JOIN_ROOM = 'initial-join-room',
  USER_JOINED_ROOM = 'user-joined-room',
  USER_LEFT_ROOM = 'user-left-room',
  NEW_MESSAGE = 'new-message',
  NEW_MESSAGE_IN_ROOM = 'new-message-in-room',
}
