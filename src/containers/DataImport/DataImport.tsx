import "./DataImport.css"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"
import Participants from "./Participants/Participants"
import Destinies from "./Destinies/Destinies"

const DataImport = () => {
  return (
    <div className="data-import">
      <Tabs>
        <TabList>
          <Tab>Participantes</Tab>
          <Tab>Destinos</Tab>
        </TabList>
        <TabPanel>
          <Participants />
        </TabPanel>
        <TabPanel>
          <Destinies />
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default DataImport
