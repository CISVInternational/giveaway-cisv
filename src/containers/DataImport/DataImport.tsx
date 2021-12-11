import "./DataImport.css"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"
import Participants from "./Participants/Participants"
import Destinies from "./Destinies/Destinies"
import { getDestinies, getParticipants } from "../../redux/selectors/general.selector"
import { useDispatch, useSelector } from "react-redux"
import Year from "./Year/Year"
import { actions } from "../../redux/slices/general.slice"
import { initPrograms } from "../../utils/utils"
const { putDestinies, putParticipants, putPrograms, putYear } = actions

const DataImport = () => {
  const dispatch = useDispatch()
  const participants = useSelector(getParticipants)
  const destines = useSelector(getDestinies)
  const reset = () => {
    dispatch(putDestinies([]));
    dispatch(putParticipants([]));
    const programs = initPrograms([], [], 2022);
    dispatch(putPrograms(programs));
    dispatch(putYear(2022));
  }
  return (
    <div className="data-import">
      <button onClick={reset}>TURBO RESET</button>
      <Tabs>
        <TabList>
          <Tab>
            <b>Paso 1:</b> Participantes
          </Tab>
          {participants.length ? (
            <Tab>
              <b>Paso 2:</b> Destinos
            </Tab>
          ) : (
            ""
          )}
          {(destines.length && participants.length) ? (
            <Tab>
              <b>Paso 3:</b> Año
            </Tab>
          ) : (
            ""
          )}
        </TabList>
        <TabPanel>
          <Participants />
        </TabPanel>
        <TabPanel>
          <Destinies />
        </TabPanel>
        <TabPanel>
          <Year />
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default DataImport
