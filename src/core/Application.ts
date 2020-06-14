import { Server, createServer } from 'http'

import express, { Application } from 'express'
import cors from 'cors'

import { SocketService } from '../services/socket.service'

export class App {
  private $app: Application

  private server: Server

  private port: string | number

  private socketService: SocketService

  constructor() {
    this.port = process.env.PORT || 4000

    this.$app = express()
    this.applyMiddleware()

    this.server = createServer(this.app)

    this.socketService = new SocketService(this.server)
  }

  get app() {
    return this.$app
  }

  public launch = () => {
    this.listen()
  }

  private applyMiddleware = () => {
    this.app.use(cors())
    this.app.options('*', cors())
  }

  private listen = () => {
    this.server.listen(this.port, () => {
      console.log(`Server started on port ${this.port}`)
    })
  }
}
