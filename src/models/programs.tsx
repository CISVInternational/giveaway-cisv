import { Destiny } from "./destinies"
import { Participant } from "./participants"

export interface Programs {
  [key: string]: Program
}
export interface Winners {
  [key: string]: Participant[]
}
export interface Program {
  rounds: (string | number)[]
  destinies: Destiny[]
  participants: Participant[]
  winners?: Winners
  waitingList?: Participant[]
  log: string[]
}
