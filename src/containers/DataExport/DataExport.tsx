import { useSelector } from "react-redux"
import { getDestinies, getPrograms } from "../../redux/selectors/general.selector"
import "./DataExport.css"
import XLSX from "xlsx"
import { saveAs } from 'file-saver';

const DataExport = () => {

  const programs = useSelector(getPrograms);
  const destinies = useSelector(getDestinies);

  let wb = XLSX.utils.book_new();

  wb.Props = {
    Title: "SheetJS Workbook",
    Subject: "Test",
    Author: "CISV International Dev Team",
    CreatedDate: new Date()
  };

  wb.SheetNames.push("Test Sheet");
  let header = ['Programa' , 'Destino'];

  const result = Object.keys(programs).reduce((acc, key) => {
    const program = programs[key];
    acc.maxParticipants = Math.max(acc.maxParticipants, program.winners.length);
    return acc;
  }, { maxParticipants: 0 });

  for (var i = 0; i < result.maxParticipants; i++) {
    header.push(`Participante ${i + 1}`);
  }

  var ws_data = [header];
  for (let key in programs) {
    const program = programs[key];
    program.destinies.forEach((destiny: any) => {
      const line = [key, destiny['lugar de destino']];
      ws_data.push(line);
    });
  }

  console.log(ws_data);
  
  var ws = XLSX.utils.aoa_to_sheet(ws_data);
  wb.Sheets["Test Sheet"] = ws;
  var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

  function s2ab(s: string) { 
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
  }

  function downloadSheet() {
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'test.xlsx');
  }

  function print() {
    console.log(destinies);
    console.log(programs);  
  }

  return (
    <div>
      <button onClick={() => downloadSheet()}>Download results</button>
      <button onClick={() => print()}>Print</button>
    </div>
  )
}

export default DataExport
