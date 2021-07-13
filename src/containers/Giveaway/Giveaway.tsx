import "./Giveaway.css"
import { useDispatch, useSelector } from "react-redux"

import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"
import { getPrograms } from "../../redux/selectors/general.selector"
import { Destiny } from "../../models/destinies"
import ProgramTab from "./ProgramTab/ProgramTab"

const Giveaway = () => {
  const programs = useSelector(getPrograms)

  return (
    <div className="giveaway">
      <Tabs>
        <TabList>
          {programs &&
            Object.entries(programs).map(([index, program]) => {
              return <Tab key={index}>{index}</Tab>
            })}
        </TabList>
        {programs &&
          Object.entries(programs).map(([index, destinies]) => {
            return (
              <TabPanel>
                <ProgramTab destinies={destinies} programName={index} />
              </TabPanel>
            )
          })}
      </Tabs>
    </div>
  )
}

export default Giveaway