import { Participant } from "../models/participants"
import { Destiny } from "../models/destinies"
import { Programs } from "../models/programs"

export const shuffleArray = (arr: any[]): any[] =>
  arr.sort(() => Math.random() - 0.5)

export function getParticipantsProgram(
  participants: Participant[],
  destinies: Destiny[]
) {
  const ages: number[] = destinies.reduce(
    (accumulator: number[], destiny: Destiny) => {
      const edades: number[] = destiny.edad.split(",").map((edad) => Number(edad))

      return [...accumulator, ...edades]
    },
    []
  )

  const participantsFiltered: Participant[] = participants.filter((participant) => {
    const age = getAge(String(participant["fecha nacimiento"]))
    return ages.includes(age)
  })

  return participantsFiltered
}

export function getAge(dateString: string) {
  var today = new Date()
  var birthDate = new Date(dateString)
  var age = today.getFullYear() - birthDate.getFullYear()
  var m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export function getRounds(participantsProgram: Participant[]) {
  return Array.from(
    new Set(participantsProgram.map((participant) => participant["ronda"]))
  )
}

export const initPrograms = (
  destinies: Destiny[],
  participants: Participant[]
): Programs => {
  const programsCSV: Programs = destinies.reduce(
    (accumulator: Programs, destiny: Destiny) => {
      if (!accumulator[destiny.programa]) {
        accumulator[destiny.programa] = {
          destinies: [destiny],
          participants: [],
          rounds: [],
        }
      } else {
        accumulator[destiny.programa].destinies.push(destiny)
      }
      return accumulator
    },
    {}
  )

  if (participants.length) {
    Object.values(programsCSV).forEach((program) => {
      program.destinies = shuffleArray(program.destinies)
      program.participants = getParticipantsProgram(participants, program.destinies)

      program.rounds = getRounds(program.participants)
    })
  }

  return programsCSV
}
