import "./DataImport.css"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"
import Participants from "./Participants/Participants"
import Destinies from "./Destinies/Destinies"
import Giveaway from "./Giveaway/Giveaway"
import {
  getDestinies,
  getParticipants,
} from "../../redux/selectors/general.selector"
import { useSelector } from "react-redux"

const DataImport = () => {
  const participants = useSelector(getParticipants)
  const destinies = useSelector(getDestinies)
  return (
    <div className="data-import">
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
          {participants.length && destinies.length ? (
            <Tab>
              <b>Paso 3:</b> Sorteo
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
          <Giveaway />
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default DataImport
