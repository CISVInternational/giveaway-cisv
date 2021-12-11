import "../DataImport.css"
import "react-tabs/style/react-tabs.css"
import { actions } from "../../../redux/slices/general.slice"
import { useDispatch, useSelector } from "react-redux"
import { getYear } from "../../../redux/selectors/general.selector"
const { putYear } = actions

const Year = () => {
  const dispatch = useDispatch()
  const year = useSelector(getYear);

  const handleChange = (event: any) => {
    dispatch(putYear(Number(event.value)));
  }

  return (
    <div>
      <input onChange={(e) => { handleChange(e.target)} } type="number" min="0" max="3000" step="1" value={year} />
    </div>
  )
}

export default Year
