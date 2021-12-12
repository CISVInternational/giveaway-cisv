import { Participant } from "../models/participants"
import { Destiny } from "../models/destinies"
import { Programs } from "../models/programs"
import _ from "lodash"

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

export const getNumber = (
  numbers: number[],
  participantsProgram: Participant[]
): number => {
  const currentNumber: number = Math.floor(
    Math.random() * participantsProgram.length + 1
  )
  //si ya ha salido ese numero busco otro
  if (numbers.includes(currentNumber)) {
    return getNumber(numbers, participantsProgram)
  }
  return currentNumber
}

export const assignRandomNumberToParticipants = (
  participantsProgram: Participant[]
) => {
  const numbers: number[] = []
  const clonedParticipants = _.cloneDeep(participantsProgram)
  clonedParticipants.forEach((participant: Participant) => {
    // if (!participant.random) {
    // preguntar a Adri: si ya tienen un numero asignado, cuando se resetea el sorteo se vuelven a asignar nuevos numeros o se mantienen los que tienen?
    const number = getNumber(numbers, participantsProgram)
    participant.random = number
    //}
    numbers.push(participant.random)
  })

  return clonedParticipants
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
          waitingList: [],
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
      let participantsProgram = getParticipantsProgram(
        participants,
        program.destinies
      )
      participantsProgram = assignRandomNumberToParticipants(participantsProgram)

      program.participants = participantsProgram

      program.rounds = getRounds(program.participants)
    })
  }

  console.log("programsCSV", programsCSV)

  return programsCSV
}
