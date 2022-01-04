import { Participant } from "../models/participants"
import { Destiny } from "../models/destinies"
import { Programs } from "../models/programs"
import _ from "lodash"

export const shuffleArray = (arr: any[]): any[] =>
  arr.sort(() => Math.random() - 0.5)

export function getParticipantsProgram(
  participants: Participant[],
  destiniesProgram: Destiny[]
) {
  const ages: number[] = destiniesProgram.reduce(
    (accumulator: number[], destiny: Destiny) => {
      const edades: number[] = destiny.edad.split(",").map((edad) => Number(edad))

      return [...accumulator, ...edades]
    },
    []
  )

  const datesDestinies: Date[] = Array.from(
    new Set(
      destiniesProgram.map((destiny) => {
        const dateDestiny = new Date(destiny["fecha"])
        return new Date(`${dateDestiny.getFullYear()}-12-31`)
      })
    )
  )
  // solo debería salir un programa, pero bueno
  const programs = Array.from(
    new Set(destiniesProgram.map((destiny: Destiny) => destiny["programa"]))
  )

  let participantsFiltered: Participant[] = participants.filter((participant) => {
    return datesDestinies.some((dateDestiny) => {
      const age = getAge(String(participant["fecha nacimiento"]), dateDestiny)
      return ages.includes(age)
    })
  })

  participantsFiltered = participantsFiltered.filter((participant) => {
    const preferences: string[] = [
      String(participant["preferencia 1"]),
      String(participant["preferencia 2"]),
      String(participant["preferencia 3"]),
      String(participant["preferencia 4"]),
    ]

    const thisProgramIsAPreference = preferences.some((preference) =>
      programs.includes(preference)
    )

    return thisProgramIsAPreference
  })

  return participantsFiltered
}

export function getAge(dateString: string, targetDate: Date) {
  const today = targetDate
  const birthDate = new Date(dateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
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
          log: [],
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
