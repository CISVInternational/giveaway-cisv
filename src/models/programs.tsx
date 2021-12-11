import { Destiny } from "./destinies"
import { Participant } from "./participants"

export interface Programs {
  [key: string]: {
    destinies: Destiny[]
    participants: Participant[]
    winners?: number[][]
  }
}
