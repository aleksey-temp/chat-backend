import { Events } from '../constants/events'
import { Debug } from '../utils/Debug'
import { roomsService } from '../services/rooms.service'
import { ConnectionsService } from '../services/connections.service'

export class Connection {
  private roomsService = roomsService

  constructor(
    private _io: SocketIO.Server,
    private _socket: SocketIO.Socket,
    private _connectionsService: ConnectionsService,
  ) {
    this.init()
  }

  get socket() {
    return this._socket
  }

  private init = () => {
    this.socket.on(Events.VALIDATE_USERNAME, this.onValidateUsername)

    this.socket.on(Events.INITIAL_JOIN_ROOM, this.onInitialJoinRoom)

    this.socket.on(Events.NEW_MESSAGE, this.onNewMessage)

    this.socket.on(Events.DISCONNECT, this.onDisconnect)
  }

  private onValidateUsername = (username: string) => {
    Debug.logEvent(Events.VALIDATE_USERNAME, username)

    const validation = this.roomsService.validateUsername(username)

    return this._io
      .to(this.socket.id)
      .emit(
        validation.valid
          ? Events.VALIDATE_USERNAME_SUCCESS
          : Events.VALIDATE_USERNAME_FAIL,
        validation,
      )
  }

  private onInitialJoinRoom = (username: string, cb: Function) => {
    const room = this.roomsService.onInitialJoin({
      id: this._socket.id,
      username,
    })

    this.socket.join(room?.name)

    this._io
      .to(room.name)
      .emit(Events.USER_JOINED_ROOM, { id: this._socket.id, username })

    cb(room)
  }

  private onNewMessage = ({
    roomName,
    from,
    message,
  }: {
    roomName: string
    from: string
    message: string
  }) => {
    const newMessage = this.roomsService.addNewMessage(roomName, from, message)

    this._io.to(roomName).emit(Events.NEW_MESSAGE_IN_ROOM, newMessage)

    Debug.logEvent(Events.NEW_MESSAGE, newMessage)
  }

  private onDisconnect = () => {
    Debug.log('client disconnected')

    this._connectionsService.removeConnection(this._socket)
    const roomName = this.roomsService.onDisconnect(this._socket.id)

    this._io.to(roomName).emit(Events.USER_LEFT_ROOM, this._socket.id)
  }
}
