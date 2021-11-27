import "../DataImport.css"
import CSVReader from "react-csv-reader"
import { useDispatch, useSelector } from "react-redux"
import { getParticipants } from "../../../redux/selectors/general.selector"
import { actions } from "../../../redux/slices/general.slice"
import "react-tabs/style/react-tabs.css"
import { parseCSV, printTable } from "../../../utils/csv"

const { putParticipants } = actions

const Participants = () => {
  const dispatch = useDispatch()
  const participants = useSelector(getParticipants)
  const loadParticipants = (data: any, fileInfo: any) => {
    let result = parseCSV(data)
    result = result.map((element: any) => {
      element.random = 0
      return element
    })
    console.log("result", result)
    dispatch(putParticipants(result))
  }

  const clearParticipants = () => {
    dispatch(putParticipants([]))
  }

  return (
    <div>
      <CSVReader label="Importar participantes" onFileLoaded={loadParticipants} />
      <button onClick={clearParticipants}>Borrar participantes</button>
      {printTable(participants)}
    </div>
  )
}

export default Participants
