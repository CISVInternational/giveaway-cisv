import "../DataImport.css"
import CSVReader from "react-csv-reader"
import "react-tabs/style/react-tabs.css"
import { Destiny } from "../../../models/destinies"
import { getDestinies, getPrograms } from "../../../redux/selectors/general.selector"
import { parseCSV, printTable } from "../../../utils/csv"
import { actions } from "../../../redux/slices/general.slice"
import { useDispatch, useSelector } from "react-redux"
import { Programs } from "../../../models/programs"
const { putDestinies, putPrograms } = actions

const Destinies = () => {
  const dispatch = useDispatch()
  const destinies = useSelector(getDestinies)
  const programs = useSelector(getPrograms)
  const loadDestinies = (data: any, fileInfo: any) => {
    console.log("destinies", data)
    const destiniesCSV: Destiny[] = parseCSV(data)
    const programsCSV: Programs = destiniesCSV.reduce(
      (accumulator: Programs, destiny: Destiny) => {
        if (!accumulator[destiny.programa]) {
          accumulator[destiny.programa] = [destiny]
        } else {
          accumulator[destiny.programa].push(destiny)
        }
        return accumulator
      },
      {}
    )
    console.log("destiniesCSV", destiniesCSV)
    console.log("programsCSV", programsCSV)
    dispatch(putDestinies(destiniesCSV))
    dispatch(putPrograms(programsCSV))
  }

  const clickHere = () => {
    console.log("destinies after parse", destinies)
    console.log("programs after parse", programs)
  }

  return (
    <div>
      <button onClick={clickHere}>eoooo</button>
      <CSVReader label="Importar destinos" onFileLoaded={loadDestinies} />
      {printTable(destinies)}
    </div>
  )
}

export default Destinies
