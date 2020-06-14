import { randomBytes } from 'crypto'

import { Room } from '../interfaces/room.interface'
import { Participant } from '../interfaces/participant.interface'
import { Message } from '../interfaces/message.interface'
import { RoomNotFoundException } from '../exceptions/RoomNotFound.exception'
import { Debug } from '../utils/Debug'

const defaultRoom: Room = {
  id: randomBytes(4).toString('hex'),
  name: 'default',
  participants: [],
  messages: [],
}

type Rooms = Record<string, Room>

class RoomsService {
  private _rooms: Rooms = {
    [defaultRoom.name]: defaultRoom,
  }
  private _roomsParticipantsMap: Record<string, string> = {}

  get rooms() {
    return this._rooms
  }

  public usernameTaken = (username: string) => {
    for (const room of Object.values(this._rooms)) {
      for (const participant of room.participants) {
        if (participant.username === username) return true
      }
    }

    return false
  }

  public validateUsername = (username: string) => {
    let validation = {
      valid: true,
      message: 'Username is available',
    }

    if (username.length < 4) {
      validation = {
        valid: false,
        message: 'The username is too short',
      }
    }

    if (username.length > 15) {
      validation = {
        valid: false,
        message: 'The username is too long',
      }
    }

    if (this.usernameTaken(username)) {
      validation = {
        valid: false,
        message: 'Username is already taken',
      }
    }

    return validation
  }

  public onInitialJoin = (participant: Participant) => {
    this.addParticipantToRoom(defaultRoom.name, participant)

    return this.findRoomByName(defaultRoom.name)
  }

  public changeRoom = (from: string, to: string, participantId: string) => {
    const participant = this.findParticipantByIdInRoom(participantId, from)

    if (!participant) {
      return
    }

    try {
      this.removeParticipantFromRoom(from, participantId)
    } catch (e) {
      if (e instanceof RoomNotFoundException) {
        Debug.log(`${from} room doesn't exist`)

        return
      }
    }

    try {
      this.addParticipantToRoom(to, participant)
    } catch (e) {
      if (e instanceof RoomNotFoundException) {
        this.createRoomAndAddParticipant(to, participant)
      }
    }
  }

  public onDisconnect = (participantId: string) => {
    const roomName = this._roomsParticipantsMap[participantId]

    if (roomName) {
      this.removeParticipantFromRoom(roomName, participantId)
    }
    return roomName
  }

  private findParticipantByIdInRoom = (id: string, roomName: string) => {
    return this.findRoomByName(roomName)?.participants.find(p => p.id === id)
  }

  private findRoomByName = (roomName: string) => {
    return this._rooms[roomName]
  }

  private removeParticipantFromRoom = (
    roomName: string,
    participantId: string,
  ) => {
    const room = this.findRoomByName(roomName)

    if (!room) {
      throw new RoomNotFoundException()
    }

    let username: string

    room.participants = room.participants.filter(p => {
      if (p.id === participantId) {
        username = p.username

        return false
      }

      return true
    })

    delete this._roomsParticipantsMap[`${participantId}`]

    console.log(this._roomsParticipantsMap)

    Debug.log(`${username!} left ${room.name} room`)
  }

  private addParticipantToRoom = (
    roomName: string,
    participant: Participant,
  ) => {
    const room = this.findRoomByName(roomName)

    if (!room) {
      throw new RoomNotFoundException()
    }

    room.participants.push(participant)
    this._roomsParticipantsMap[`${participant.id}`] = room.name

    console.log(this._roomsParticipantsMap)

    Debug.log(`${participant.username} joined ${room.name} room`)
  }

  private createRoomAndAddParticipant = (
    roomName: string,
    participant: Participant,
  ) => {
    this._rooms[roomName] = {
      id: this.generateUniqueId(),
      messages: [],
      name: roomName,
      participants: [participant],
    }

    this._roomsParticipantsMap[`${participant.id}`] = roomName
  }

  private generateUniqueId = () => randomBytes(4).toString('hex')

  public addNewMessage = (roomName: string, from: string, content: string) => {
    const message: Message = {
      id: this.generateUniqueId(),
      from,
      message: content,
    }

    this._rooms[roomName].messages.push(message)

    return message
  }
}

export const roomsService = new RoomsService()
