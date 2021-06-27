import "./DataImport.css"
import CSVReader from "react-csv-reader"
import { useDispatch, useSelector } from "react-redux"
import { getParticipants } from "../../redux/selectors/general.selector"
import { actions } from "../../redux/slices/general.slice"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"

const { putParticipants } = actions

const DataImport = () => {
  const dispatch = useDispatch()
  const participants = useSelector(getParticipants)
  const loadParticipants = (data: any, fileInfo: any) => {
    console.log("participants", data)
    dispatch(putParticipants(data))
  }
  const loadDestinies = (data: any, fileInfo: any) => {
    console.log("destinies", data)
  }
  return (
    <div className="data-import">
      <Tabs>
        <TabList>
          <Tab>Participantes</Tab>
          <Tab>Destinos</Tab>
        </TabList>

        <TabPanel>
          <button
            onClick={() => {
              console.log("participantsss", participants)
            }}
          >
            eooo
          </button>
          <CSVReader
            label="Importar participantes"
            onFileLoaded={loadParticipants}
          />
        </TabPanel>
        <TabPanel>
          <CSVReader label="Importar destinos" onFileLoaded={loadDestinies} />
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default DataImport
