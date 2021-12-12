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
import { Programs, Winners, Program } from "../../../models/programs"
import { shuffleArray } from "../../../utils/utils"
const { putWinnersProgram, putWaitingListProgram } = actions

const ProgramTab = (props: any) => {
  const dispatch = useDispatch()
  const { destinies, programName } = props
  const programs: Programs = useSelector(getPrograms)

  const rounds: (string | number)[] = programs[programName].rounds
  const participantsProgram: Participant[] = programs[programName].participants
  const waitingList: Participant[] | undefined = programs[programName].waitingList

  const winnersDestinies: Winners | undefined = programs[programName].winners

  const getNumbersParticipants = (): {
    numbersGirls: number[]
    numbersBoys: number[]
  } => {
    const numbers = participantsProgram.reduce(
      (
        accumulator: {
          numbersGirls: number[]
          numbersBoys: number[]
        },
        participant: Participant
      ) => {
        if (participant["sexo"] === "f") {
          accumulator.numbersGirls.push(participant.random)
        }
        if (participant["sexo"] === "m") {
          accumulator.numbersBoys.push(participant.random)
        }
        return accumulator
      },
      { numbersGirls: [], numbersBoys: [] }
    )

    return numbers
  }

  const getNumbersForThisRound = (
    numbers: number[],
    round: string | number
  ): number[] => {
    const numbersRound = numbers.filter((number) => {
      const child = participantsProgram.find((participant: Participant) => {
        return participant.random === number
      })
      return child ? child["ronda"] === round : false
    })

    return numbersRound
  }

  const isWinnerInAnotherProgram = (winner: Participant, programName: string) => {
    return Object.entries(programs).find(([name, program]) => {
      if (name !== programName && program.winners) {
        const winnersProgram: string[] = Object.values(program.winners).reduce(
          (accumulator: string[], participants: Participant[]): string[] => {
            const stringsParticipants: string[] = participants.map(
              (p) => `${p["nombre y apellidos"]}${p["fecha de nacimiento"]}`
            )
            return [...accumulator, ...stringsParticipants]
          },
          []
        )
        const isHere = winnersProgram.includes(
          `${winner["nombre y apellidos"]}${winner["fecha de nacimiento"]}`
        )

        return isHere
      }

      return false
    })
  }

  const shouldReassignWinners = (winners: Winners) => {
    Object.entries(winners).forEach(([destinyName, winners]) => {
      winners.forEach((winner) => {
        const isWinner = isWinnerInAnotherProgram(winner, programName)
        console.log("isWinner", isWinner)
      })
    })
  }

  const setWinners = (): number[] => {
    const assignedParticipants: number[] = []

    const { numbersGirls, numbersBoys } = getNumbersParticipants()

    const winners = rounds.reduce(
      (accumulator: any, round: number | string): Winners => {
        const numbersBoysRound = getNumbersForThisRound(numbersBoys, round)
        const numbersGirlsRound = getNumbersForThisRound(numbersGirls, round)

        destinies.forEach((destiny: Destiny, index: number) => {
          if (!accumulator[destiny["lugar de destino"]]) {
            accumulator[destiny["lugar de destino"]] = []
          }
          if (
            accumulator[destiny["lugar de destino"]].length <
            Number(destiny["participantes (m)"]) +
              Number(destiny["participantes (f)"])
          ) {
            const shuffledBoys = shuffleArray(numbersBoysRound)
            const shuffledGirls = shuffleArray(numbersGirlsRound)

            const destinyBoys = [...new Array(Number(destiny["participantes (m)"]))]
              .map((position: any, index: number) => {
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
              })
              .filter((number) => !!number)

            const participantsBoys = participantsProgram.filter((p) =>
              destinyBoys.includes(p.random)
            )

            const destinyGirls = [...new Array(Number(destiny["participantes (f)"]))]
              .map((position: any, index: number) => {
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
              .filter((number) => !!number)

            const participantsGirls = participantsProgram.filter((p) =>
              destinyGirls.includes(p.random)
            )

            accumulator[destiny["lugar de destino"]] = [
              ...accumulator[destiny["lugar de destino"]],
              ...participantsBoys,
              ...participantsGirls,
            ]
          }
        })
        return accumulator
      },
      {}
    )
    console.log("winners", winners)

    shouldReassignWinners(winners)

    dispatch(
      putWinnersProgram({
        program: programName,
        winners,
      })
    )

    return assignedParticipants
  }

  const setWaitingList = (numbersWinners: number[]) => {
    const numbersParticipants = participantsProgram.map(
      (participant) => participant.random
    )

    const waitingListNumbers = numbersParticipants
      .filter((number) => !numbersWinners.includes(number))
      .sort()

    const waitingList: Participant[] = participantsProgram.filter((p) =>
      waitingListNumbers.includes(p.random)
    )

    dispatch(
      putWaitingListProgram({
        program: programName,
        waitingList,
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

  const startGiveaway = () => {
    const numbersWinners = setWinners()
    setWaitingList(numbersWinners)
  }

  const renderParticipantsProgram = () => {
    return (
      <div className="row__cell--6">
        <table>
          <thead>
            <tr>
              <th colSpan={3}>Participantes</th>
            </tr>
            <tr>
              <th>Número</th>
              <th>Ronda</th>
              <th>Nombre</th>
              <th>Fecha nacimiento</th>
              <th>Sexo</th>
              <th>Preferencia 1</th>
              <th>Preferencia 2</th>
              <th>Preferencia 3</th>
              <th>Preferencia 4</th>
            </tr>
          </thead>
          <tbody>
            {participantsProgram.map((participant: Participant, index: number) => {
              return (
                <tr key={index}>
                  <td>{participant["random"] > 0 ? participant["random"] : ""}</td>
                  <td>{participant["ronda"]}</td>
                  <td>{participant["nombre y apellidos"]}</td>
                  <td>{participant["fecha nacimiento"]}</td>
                  <td>{participant["sexo"]}</td>
                  <td>{participant["preferencia 1"]}</td>
                  <td>{participant["preferencia 2"]}</td>
                  <td>{participant["preferencia 3"]}</td>
                  <td>{participant["preferencia 4"]}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  const renderWaitingList = () => {
    return (
      <div className="row__cell--6">
        <table>
          <thead>
            <tr>
              <th colSpan={3}>Lista de espera</th>
            </tr>
            <tr>
              <th>Número</th>
              <th>Ronda</th>
              <th>Nombre</th>
              <th>Fecha nacimiento</th>
              <th>Sexo</th>
            </tr>
          </thead>
          <tbody>
            {waitingList &&
              waitingList.map((participant: Participant, index) => {
                return (
                  <tr key={index}>
                    <td>{participant["random"] > 0 ? participant["random"] : ""}</td>
                    <td>{participant["ronda"]}</td>
                    <td>{participant["nombre y apellidos"]}</td>
                    <td>{participant["fecha nacimiento"]}</td>
                    <td>{participant["sexo"]}</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    )
  }

  const renderDestiniesProgram = () => {
    return (
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
              <th>Ganadores</th>
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
                          winnersDestinies[destiny["lugar de destino"]] &&
                          winnersDestinies[destiny["lugar de destino"]].map(
                            (
                              winnerParticipant: Participant,
                              indexDestiny: number
                            ) => {
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
    )
  }

  return (
    <div className="row">
      <div className="row__cell--12 center">
        <div className="rounds">Hay {rounds.length} rondas</div>
        <button className="btn__start-giveaway" onClick={startGiveaway}>
          Comenzar sorteo
        </button>
      </div>
      {destinies && destinies.length && renderDestiniesProgram()}
      {participantsProgram &&
        participantsProgram.length &&
        renderParticipantsProgram()}
      {waitingList && waitingList.length && renderWaitingList()}
    </div>
  )
}

export default ProgramTab
