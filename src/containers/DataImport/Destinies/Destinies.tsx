import "../DataImport.css"
import CSVReader from "react-csv-reader"
import "react-tabs/style/react-tabs.css"
import { Destiny } from "../../../models/destinies"
import {
  getDestinies,
  getParticipants,
} from "../../../redux/selectors/general.selector"
import { parseCSV, printTable } from "../../../utils/csv"
import { actions } from "../../../redux/slices/general.slice"
import { useDispatch, useSelector } from "react-redux"
import { Programs } from "../../../models/programs"
import { initPrograms } from "../../../utils/utils"
const { putDestinies, putPrograms } = actions

const Destinies = () => {
  const dispatch = useDispatch()
  const destinies = useSelector(getDestinies)
  const participants = useSelector(getParticipants)
  const loadDestinies = (data: any, fileInfo: any) => {
    const destiniesCSV: Destiny[] = parseCSV(data)
    const programsCSV: Programs = initPrograms(destiniesCSV, participants)

    console.log("destiniesCSV", destiniesCSV)
    console.log("programsCSV", programsCSV)
    dispatch(putDestinies(destiniesCSV))
    dispatch(putPrograms(programsCSV))
  }

  const clearDestinies = () => {
    if (
      window.confirm(
        "¿Estás seguro? Esto reseteará toda la información de los sorteos"
      )
    ) {
      dispatch(putDestinies([]))
      dispatch(putPrograms([]))
    }
  }

  return (
    <div className="row">
      <div className="row__cell--11 margin-bottom">
        <CSVReader label="Importar destinos" onFileLoaded={loadDestinies} />
      </div>
      <div className="row__cell--1 margin-bottom">
        <button onClick={clearDestinies}>Borrar destinos</button>
      </div>
      <div className="row__cell--12">
        {destinies.length ? printTable(destinies) : ""}
      </div>
    </div>
  )
}

export default Destinies
