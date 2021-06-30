import "../DataImport.css"
import CSVReader from "react-csv-reader"
import { useDispatch, useSelector } from "react-redux"
import { getParticipants } from "../../../redux/selectors/general.selector"
import { actions } from "../../../redux/slices/general.slice"
import "react-tabs/style/react-tabs.css"

import { Participant } from "../../../models/participants"

const { putParticipants } = actions

const Participants = () => {
  const dispatch = useDispatch()
  const participants = useSelector(getParticipants)
  const loadParticipants = (data: any, fileInfo: any) => {
    const result = parseParticipants(data)
    console.log("result", result)
    dispatch(putParticipants(result))
  }
  const parseParticipants = (data: any): Participant[] => {
    let result = []
    if (data.length) {
      const header = data[0]
      data.shift()
      result = data.map((element: any) => {
        element = Object.values(element).reduce(
          (accumulator: Participant, value: any, index: number) => {
            accumulator[header[index]] = value
            return accumulator
          },
          {}
        )
        return element
      })
    }
    return result
  }

  const printRowHeader = (participants: any) => {
    return (
      <tr>
        {Object.keys(participants[0]).map((header: string, index: number) => {
          return <th key={index}>{header}</th>
        })}
      </tr>
    )
  }

  const printRowParticipants = (participants: Participant[]) => {
    return participants.map((participant: Participant, index: number) => {
      return (
        <tr key={index}>
          {Object.values(participant).map((value: string, indexValue: number) => {
            return <td key={indexValue}>{value}</td>
          })}
        </tr>
      )
    })
  }

  return (
    <div>
      <CSVReader label="Importar participantes" onFileLoaded={loadParticipants} />
      {participants.length && (
        <div className="table-participants">
          <table>
            <thead>{printRowHeader(participants)}</thead>
            <tbody>{printRowParticipants(participants)}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Participants
