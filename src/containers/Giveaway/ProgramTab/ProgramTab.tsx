import "./ProgramTab.css"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import "react-tabs/style/react-tabs.css"
import { Destiny } from "../../../models/destinies"
import { getParticipants } from "../../../redux/selectors/general.selector"
import { getPrograms } from "../../../redux/selectors/general.selector"
import { Participant } from "../../../models/participants"
import { actions } from "../../../redux/slices/general.slice"
import * as _ from "lodash"
import { Programs } from "../../../models/programs"
const { putParticipantsProgram, putWinnersProgram } = actions

function getParticipantsProgram(
  participants: Participant[],
  destinies: Destiny[],
  participantsRedux: Participant[]
) {
  if (participantsRedux.length) {
    return participantsRedux
  }

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

function getAge(dateString: string) {
  var today = new Date()
  var birthDate = new Date(dateString)
  var age = today.getFullYear() - birthDate.getFullYear()
  var m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

const ProgramTab = (props: any) => {
  const dispatch = useDispatch()
  const { destinies, programName } = props
  const programs = useSelector(getPrograms)
  const participants = useSelector(getParticipants)
  const participantsProgram: Participant[] = getParticipantsProgram(
    participants,
    destinies,
    programs[programName].participants
  )

  const [numbersParticipants, setNumbersParticipants] = useState<number[]>([])
  const winnersDestinies = programs[programName].winners

  const assignNumberToParticipants = () => {
    let clonedParticipants = _.cloneDeep(participantsProgram)

    const numbers: number[] = [],
      numbersGirls: number[] = [],
      numbersBoys: number[] = []
    clonedParticipants = clonedParticipants.map((participant: Participant) => {
      if (!participant.random) {
        const number = getNumber(numbers)
        participant.random = number
      }
      numbers.push(participant.random)
      if (participant["sexo"] === "f") {
        numbersGirls.push(participant.random)
      } else {
        numbersBoys.push(participant.random)
      }

      return participant
    })
    setNumbersParticipants(numbers)
    dispatch(
      putParticipantsProgram({
        program: programName,
        participants: clonedParticipants,
      })
    )

    return { numbersGirls, numbersBoys }
  }

  const getNumber = (numbers: number[]): number => {
    const currentNumber: number = Math.floor(
      Math.random() * participantsProgram.length + 1
    )
    //si ya ha salido ese numero busco otro
    if (numbers.includes(currentNumber)) {
      return getNumber(numbers)
    }
    return currentNumber
  }

  const assingParticipantsToDestinies = () => {
    const assignedParticipants: number[] = []

    const { numbersGirls, numbersBoys } = assignNumberToParticipants()

    const participantsToDestinies = destinies.reduce(
      (accumulator: any, destiny: Destiny, index: number) => {
        const shuffledBoys = shuffleArray(numbersBoys)
        const shuffledGirls = shuffleArray(numbersGirls)

        const destinyBoys = [...new Array(Number(destiny["participantes (m)"]))].map(
          (position: any, index: number) => {
            if (assignedParticipants.length < participantsProgram.length) {
              const numberParticipant: number | undefined = getNumberParticipant(
                shuffledBoys,
                assignedParticipants
              )
              if (numberParticipant) {
                assignedParticipants.push(numberParticipant)
              }

              return numberParticipant
            }
            return undefined
          }
        )

        const destinyGirls = [
          ...new Array(Number(destiny["participantes (f)"])),
        ].map((position: any, index: number) => {
          if (assignedParticipants.length < participantsProgram.length) {
            const numberParticipant: number | undefined = getNumberParticipant(
              shuffledGirls,
              assignedParticipants
            )
            if (numberParticipant) {
              assignedParticipants.push(numberParticipant)
            }

            return numberParticipant
          }
          return undefined
        })

        accumulator[index] = [...destinyBoys, ...destinyGirls]
        return accumulator
      },
      []
    )

    dispatch(
      putWinnersProgram({
        program: programName,
        winners: participantsToDestinies,
      })
    )
  }

  const getNumberParticipant = (
    shuffledArray: number[],
    assignedArray: number[],
    index = 0
  ): number | undefined => {
    if (index === 1000) {
      //dado que es una función recursiva ponemos un máximo de veces para el loop
      return undefined
    }
    if (assignedArray.includes(shuffledArray[index])) {
      return getNumberParticipant(shuffledArray, assignedArray, index + 1)
    }
    return shuffledArray[index]
  }

  const shuffleArray = (arr: any[]): any[] => arr.sort(() => Math.random() - 0.5)

  const startGiveaway = () => {
    assingParticipantsToDestinies()
  }

  return (
    <div className="row">
      <div className="row__cell--12 center">
        <button className="btn__start-giveaway" onClick={startGiveaway}>
          Comenzar sorteo
        </button>
      </div>
      <div className="row__cell--6">
        <table>
          <thead>
            <tr>
              <th colSpan={3}>Destinos</th>
            </tr>
            <tr>
              <th>Número</th>
              <th>Destino</th>
              <th>Chicos</th>
              <th>Chicas</th>
            </tr>
          </thead>
          <tbody>
            {destinies &&
              destinies.map((destiny: Destiny, index: number) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{destiny["lugar de destino"]}</td>
                    <td>{destiny["participantes (m)"]}</td>
                    <td>{destiny["participantes (f)"]}</td>
                    <td>
                      <ul>
                        {winnersDestinies &&
                          winnersDestinies[index] &&
                          winnersDestinies[index].map(
                            (winner: number, indexDestiny: number) => {
                              const winnerParticipant = participantsProgram.find(
                                (p) => p.random === winner
                              )
                              return (
                                <li key={index + indexDestiny}>
                                  {winnerParticipant
                                    ? `${winnerParticipant.random} - ${winnerParticipant["nombre y apellidos"]}`
                                    : ""}
                                </li>
                              )
                            }
                          )}
                      </ul>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
      <div className="row__cell--6">
        <table>
          <thead>
            <tr>
              <th colSpan={3}>Participantes</th>
            </tr>
            <tr>
              <th>Número</th>
              <th>Nombre</th>
              <th>Fecha nacimiento</th>
              <th>Sexo</th>
            </tr>
          </thead>
          <tbody>
            {participantsProgram.map((participant: Participant, index: number) => {
              return (
                <tr key={index}>
                  <td>{participant["random"] > 0 ? participant["random"] : ""}</td>
                  <td>{participant["nombre y apellidos"]}</td>
                  <td>{participant["fecha nacimiento"]}</td>
                  <td>{participant["sexo"]}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProgramTab
