import { useSelector } from "react-redux"
import { getDestinies, getParticipants, getPrograms } from "../../redux/selectors/general.selector"
import "./DataExport.css"

const DataExport = () => {

  const participants = useSelector(getParticipants)
  const programs = useSelector(getPrograms)
  const destinies = useSelector(getDestinies)
  console.log(participants);
  console.log(programs);

  return (
    <div>
      Data Export
    </div>
  )
}

export default DataExport
