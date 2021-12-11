import "../DataImport.css"
import CSVReader from "react-csv-reader"
import { useDispatch, useSelector } from "react-redux"
import { getParticipants } from "../../../redux/selectors/general.selector"
import { actions } from "../../../redux/slices/general.slice"
import "react-tabs/style/react-tabs.css"
import { parseCSV, printTable } from "../../../utils/csv"

const { putParticipants, putDestinies } = actions

const Participants = () => {
  const dispatch = useDispatch()
  const participants = useSelector(getParticipants)
  const loadParticipants = (data: any, fileInfo: any) => {
    let result = parseCSV(data)
    result = result.map((element: any) => {
      element.random = 0
      return element
    })
    dispatch(putParticipants(result))
  }

  const clearParticipants = () => {
    dispatch(putParticipants([]))
    dispatch(putDestinies([]))
  }

  return (
    <div>
      <CSVReader label="Importar participantes" onFileLoaded={loadParticipants} />
      <button onClick={clearParticipants}>Borrar participantes</button>
      {participants.length ? printTable(participants) : ""}
    </div>
  )
}

export default Participants
