import "./ProgramTab.css"
import { useDispatch, useSelector } from "react-redux"
import "react-tabs/style/react-tabs.css"
import { Destiny } from "../../../models/destinies"
import { getParticipants } from "../../../redux/selectors/general.selector"
import { Participant } from "../../../models/participants"
import Randomizer from "../../../components/Randomizer/Randomizer"

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
  const ages: number[] = destinies.reduce(
    (accumulator: number[], destiny: Destiny) => {
      const edades: number[] = destiny.edad.split(",").map((edad) => Number(edad))

      return [...accumulator, ...edades]
    },
    []
  )
  const participants = useSelector(getParticipants)
  let participantsProgram = getParticipantsProgram(participants, ages)
  const assignNumberToParticipants = () => {
    participantsProgram = participantsProgram.map((participant: Participant) => {
      participant.random = Math.floor(Math.random() * participantsProgram.length)
      return participant
    })
  }
  const startGiveaway = () => {
    assignNumberToParticipants()
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
                <td>{participant["random"]}</td>
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
      <Randomizer
        numbers={[1, 2, 3, 4, 5, 6, 7, 8]}
      />
    </div>
  )
}

export default ProgramTab
