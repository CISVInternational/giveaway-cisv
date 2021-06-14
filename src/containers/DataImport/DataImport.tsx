
import './DataImport.css';
import CSVReader from 'react-csv-reader'
import { useDispatch, useSelector } from "react-redux";
import { getParticipants } from '../../redux/selectors/general.selector'
import { actions } from '../../redux/slices/general.slice'

const { putParticipants } = actions


const DataImport = () => {
  const dispatch = useDispatch();
  const participants = useSelector(getParticipants)
  return (
    
    <div className="data-import">
      <button onClick={() =>{console.log("participantsss", participants)}}>eooo</button>
        <CSVReader label="Importar participantes" onFileLoaded={(data, fileInfo) => dispatch(putParticipants(data))} />
        <CSVReader label="Importar programas" onFileLoaded={(data, fileInfo) => console.log("programs", data)} />
    </div>
  );
}

export default DataImport;
