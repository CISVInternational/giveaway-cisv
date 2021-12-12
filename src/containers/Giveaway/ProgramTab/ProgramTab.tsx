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
import { Programs, Winners } from "../../../models/programs"
import { shuffleArray } from "../../../utils/utils"
const { putParticipantsProgram, putWinnersProgram, putWaitingListProgram } = actions

const ProgramTab = (props: any) => {
  const dispatch = useDispatch()
  const { destinies, programName } = props
  const programs = useSelector(getPrograms)

  const rounds: number[] = programs[programName].rounds
  const participantsProgram: Participant[] = programs[programName].participants
  const waitingList: number[] = programs[programName].waitingList

  const winnersDestinies = programs[programName].winners

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

            const destinyBoys = [
              ...new Array(Number(destiny["participantes (m)"])),
            ].map((position: any, index: number) => {
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

            accumulator[destiny["lugar de destino"]] = [
              ...accumulator[destiny["lugar de destino"]],
              ...destinyBoys.filter((number) => !!number),
              ...destinyGirls.filter((number) => !!number),
            ]
          }
        })
        return accumulator
      },
      {}
    )
    console.log("winners", winners)

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

    const waitingList = numbersParticipants
      .filter((number) => !numbersWinners.includes(number))
      .sort()

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
            {waitingList.map((numberParticipant, index) => {
              const participant = participantsProgram.find(
                (p) => p.random == numberParticipant
              )
              if (participant) {
                return (
                  <tr key={index}>
                    <td>{participant["random"] > 0 ? participant["random"] : ""}</td>
                    <td>{participant["ronda"]}</td>
                    <td>{participant["nombre y apellidos"]}</td>
                    <td>{participant["fecha nacimiento"]}</td>
                    <td>{participant["sexo"]}</td>
                  </tr>
                )
              } else {
                return ""
              }
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
      {destinies && renderDestiniesProgram()}
      {participantsProgram && renderParticipantsProgram()}
      {waitingList && renderWaitingList()}
    </div>
  )
}

export default ProgramTab
