import "../DataImport.css"
import CSVReader from "react-csv-reader"
import { useDispatch, useSelector } from "react-redux"
import {
  getDestinies,
  getParticipants,
} from "../../../redux/selectors/general.selector"
import { actions } from "../../../redux/slices/general.slice"
import "react-tabs/style/react-tabs.css"
import { initPrograms } from "../../../utils/utils"
import { parseCSV, printTable } from "../../../utils/csv"
import { Programs } from "../../../models/programs"
import { Participant } from "../../../models/participants"

const { putParticipants, putPrograms } = actions

const Participants = () => {
  const dispatch = useDispatch()
  const participants = useSelector(getParticipants)
  const destinies = useSelector(getDestinies)
  const loadParticipants = (data: any, fileInfo: any) => {
    const jsonCSV = parseCSV(data)
    const participantsCSV: Participant[] = jsonCSV.map(
      (element: any): Participant => {
        element.random = 0
        return element
      }
    )
    dispatch(putParticipants(participantsCSV))
    if (destinies.length) {
      const programsCSV: Programs = initPrograms(destinies, participantsCSV)
      dispatch(putPrograms(programsCSV))
    }
  }

  const clearParticipants = () => {
    if (
      window.confirm(
        "¿Estás seguro? Esto reseteará toda la información de los sorteos"
      )
    ) {
      dispatch(putParticipants([]))
      dispatch(putPrograms([]))
    }
  }

  return (
    <div className="row">
      <div className="row__cell--11 margin-bottom">
        <CSVReader label="Importar participantes" onFileLoaded={loadParticipants} />
      </div>
      <div className="row__cell--1 margin-bottom">
        <button onClick={clearParticipants}>Borrar participantes</button>
      </div>
      <div className="row__cell--12 margin-bottom">
        {participants.length ? printTable(participants) : ""}
      </div>
    </div>
  )
}

export default Participants
