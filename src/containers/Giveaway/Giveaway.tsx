import "./Giveaway.css"
import { useDispatch, useSelector } from "react-redux"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"
import {
  getPrograms,
  getParticipants,
  getDestinies,
} from "../../redux/selectors/general.selector"
import { actions } from "../../redux/slices/general.slice"
import { Destiny } from "../../models/destinies"
import { Programs } from "../../models/programs"
import { Participant } from "../../models/participants"
import ProgramTab from "./ProgramTab/ProgramTab"
import { initPrograms } from "../../utils/utils"
const { putPrograms } = actions

const Giveaway = () => {
  const dispatch = useDispatch()
  const programs: Programs = useSelector(getPrograms)
  const destinies: Destiny[] = useSelector(getDestinies)
  const participants: Participant[] = useSelector(getParticipants)
  const resetPrograms = () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres resetear los sorteos? Todos los ganadores y logs se perderán"
      )
    ) {
      const programsReset = initPrograms(destinies, participants)
      dispatch(putPrograms(programsReset))
    }
  }

  const renderPrograms = () => {
    return (
      <div className="giveaway">
        <div className="pull-right">
          <button className="" onClick={resetPrograms}>
            Resetear todos los sorteos
          </button>
        </div>
        <div className="tabs-giveaway">
          <Tabs>
            <TabList>
              {programs &&
                Object.entries(programs).map(([index, program]) => {
                  return <Tab key={index}>{index}</Tab>
                })}
            </TabList>
            {programs &&
              Object.entries(programs).map(([index, program]) => {
                return (
                  <TabPanel className="tabpanel__container" key={index}>
                    <ProgramTab destinies={program.destinies} programName={index} />
                  </TabPanel>
                )
              })}
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <div className="row-giveaway">
      {programs && Object.entries(programs).length ? (
        renderPrograms()
      ) : (
        <div className="row__cell--12">
          No se han cargado todos los datos necesarios para mostrar los sorteos,
          revisa la pestaña Import
        </div>
      )}
    </div>
  )
}

export default Giveaway
