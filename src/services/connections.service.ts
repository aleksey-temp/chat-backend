import { Connection } from '../entities/Connection'
import { Debug } from '../utils/Debug'

export class ConnectionsService {
  private _connections: Connection[] = []

  addConnection = (conn: Connection) => {
    this._connections.push(conn)

    Debug.log(`connections: ${this._connections.length}`)
  }

  removeConnection = (socket: SocketIO.Socket) => {
    const { id } = socket
    const connIndex = this._connections.findIndex(conn => conn.socket.id)

    if (connIndex !== -1) {
      this._connections.splice(connIndex, 1)

      Debug.log(`connections: ${this._connections.length}`)
    }
  }
}
