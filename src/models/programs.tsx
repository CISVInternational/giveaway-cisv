import { Destiny } from "./destinies"
import { Participant } from "./participants"

export interface Programs {
  [key: string]: Program
}
export interface Winners {
  [key: string]: number[]
}
export interface Program {
  rounds: (string | number)[]
  destinies: Destiny[]
  participants: Participant[]
  winners?: Winners
  waitingList?: number[]
}
