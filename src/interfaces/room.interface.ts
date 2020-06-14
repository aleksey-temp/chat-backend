import { Participant } from './participant.interface'
import { Message } from './message.interface'

export interface Room {
  id: string
  name: string
  participants: Participant[]
  messages: Message[]
}
