import "../DataImport.css"
import CSVReader from "react-csv-reader"
import "react-tabs/style/react-tabs.css"
import { Destiny } from "../../../models/destinies"
import {
  getDestinies,
  getParticipants,
  getYear,
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
  const participants = useSelector(getYear)
  const year = useSelector(getParticipants)
  const loadDestinies = (data: any, fileInfo: any) => {
    const destiniesCSV: Destiny[] = parseCSV(data)
    const programsCSV: Programs = initPrograms(destiniesCSV, participants, year)

    console.log("destiniesCSV", destiniesCSV)
    console.log("programsCSV", programsCSV)
    dispatch(putDestinies(destiniesCSV))
    dispatch(putPrograms(programsCSV))
  }

  const clearDestinies = () => {
    dispatch(putDestinies([]))
  }

  return (
    <div>
      <CSVReader label="Importar destinos" onFileLoaded={loadDestinies} />
      <button onClick={clearDestinies}>Borrar destinos</button>
      {destinies.length ? printTable(destinies) : ""}
    </div>
  )
}

export default Destinies
