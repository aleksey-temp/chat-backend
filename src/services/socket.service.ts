import { Server } from 'http'

import socketIO from 'socket.io'

import { ConnectionsService } from '../services/connections.service'
import { Events } from '../constants/events'
import { Debug } from '../utils/Debug'
import { Connection } from '../entities/Connection'

export class SocketService {
  private io: SocketIO.Server
  private connectionsService = new ConnectionsService()

  constructor(private server: Server) {
    this.io = socketIO(server)

    this.init()
  }

  private init = () => {
    this.io.on(Events.CONNECT, this.onConnect)
  }

  private onConnect = (socket: SocketIO.Socket) => {
    Debug.log('client connected')

    this.connectionsService.addConnection(
      new Connection(this.io, socket, this.connectionsService),
    )
  }
}
