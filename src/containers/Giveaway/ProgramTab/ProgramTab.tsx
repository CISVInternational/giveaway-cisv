import "./ProgramTab.css"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import "react-tabs/style/react-tabs.css"
import { Destiny } from "../../../models/destinies"
import { getParticipants } from "../../../redux/selectors/general.selector"
import { Participant } from "../../../models/participants"
import Randomizer from "../../../components/Randomizer/Randomizer"
import * as _ from "lodash"

const getParticipantsProgram = (
  participants: Participant[],
  ages: number[]
): Participant[] => {
  return participants.filter((participant) => {
    const age = getAge(String(participant["fecha nacimiento"]))
    return ages.includes(age)
  })
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
  const { destinies, programName } = props
  const [participantsProgram, setParticipantsProgram] = useState<Participant[]>([])
  const [numbersParticipants, setNumbersParticipants] = useState<number[]>([])
  const [numbersGirlsParticipants, setNumbersGirlsParticipants] = useState<number[]>(
    []
  )
  const [numbersBoysParticipants, setNumbersBoysParticipants] = useState<number[]>(
    []
  )
  const [winnersDestinies, setWinnersDestinies] = useState<any[]>([])
  const ages: number[] = destinies.reduce(
    (accumulator: number[], destiny: Destiny) => {
      const edades: number[] = destiny.edad.split(",").map((edad) => Number(edad))

      return [...accumulator, ...edades]
    },
    []
  )
  const participants = useSelector(getParticipants)
  // const participantsProgram = getParticipantsProgram(participants, ages)
  useEffect(() => {
    setParticipantsProgram(getParticipantsProgram(participants, ages))
  }, [])

  const assignNumberToParticipants = () => {
    let clonedParticipants = _.cloneDeep(participantsProgram)
    const numbers: number[] = [],
      numbersGirls: number[] = [],
      numbersBoys: number[] = []
    clonedParticipants = clonedParticipants.map((participant: Participant) => {
      const number = getNumber(numbers)
      numbers.push(number)
      if (participant["sexo"] === "f") {
        numbersGirls.push(number)
      } else {
        numbersBoys.push(number)
      }
      participant.random = number
      return participant
    })
    setNumbersParticipants(numbers)
    setNumbersGirlsParticipants(numbersGirls)
    setNumbersBoysParticipants(numbersBoys)
    setParticipantsProgram(clonedParticipants)
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

    const participantsToDestinies = destinies.reduce(
      (accumulator: any, destiny: Destiny, index: number) => {
        const shuffledBoys = shuffleArray(numbersBoysParticipants)
        const shuffledGirls = shuffleArray(numbersGirlsParticipants)

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

    setWinnersDestinies(participantsToDestinies)

    console.log("destiniesGiveaway", participantsToDestinies)
  }

  const getNumberParticipant = (
    shuffledArray: number[],
    assignedArray: number[],
    index = 0
  ): number | undefined => {
    if (index === 1000) {
      return undefined
    }
    if (assignedArray.includes(shuffledArray[index])) {
      return getNumberParticipant(shuffledArray, assignedArray, index + 1)
    }
    return shuffledArray[index]
  }

  const shuffleArray = (arr: any[]): any[] => arr.sort(() => Math.random() - 0.5)

  const startGiveaway = () => {
    assignNumberToParticipants()
    assingParticipantsToDestinies()
  }

  return (
    <div className="row">
      <div className="row__cell--6">
        <table>
          <tr>
            <th colSpan={3}>Destinos</th>
          </tr>
          <tr>
            <th>Número</th>
            <th>Destino</th>
            <th>Chicos</th>
            <th>Chicas</th>
          </tr>

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
        </table>
      </div>
      <div className="row__cell--6">
        <table>
          <tr>
            <th colSpan={3}>Participantes</th>
          </tr>
          <tr>
            <th>Número</th>
            <th>Nombre</th>
            <th>Sexo</th>
          </tr>
          {participantsProgram.map((participant: Participant, index: number) => {
            return (
              <tr key={index}>
                <td>{participant["random"] > 0 ? participant["random"] : ""}</td>
                <td>{participant["nombre y apellidos"]}</td>
                <td>{participant["sexo"]}</td>
              </tr>
            )
          })}
        </table>
      </div>
      <div className="row__cell--12">
        <button onClick={startGiveaway}>Comenzar sorteo</button>
      </div>
    </div>
  )
}

export default ProgramTab
