import "../DataImport.css"
import CSVReader from "react-csv-reader"
import "react-tabs/style/react-tabs.css"

const Destinies = () => {
  const loadDestinies = (data: any, fileInfo: any) => {
    console.log("destinies", data)
  }
  return (
    <div>
      <CSVReader label="Importar destinos" onFileLoaded={loadDestinies} />
    </div>
  )
}

export default Destinies
