import { useSelector } from "react-redux"
import { getPrograms } from "../../redux/selectors/general.selector"
import "./DataExport.css"
import XLSX from "xlsx"
import { saveAs } from 'file-saver';

const DataExport = () => {

  const programs = useSelector(getPrograms)
  console.log(programs);

  let wb = XLSX.utils.book_new();

  wb.Props = {
    Title: "SheetJS Workbook",
    Subject: "Test",
    Author: "CISV International Dev Team",
    CreatedDate: new Date()
  };

  wb.SheetNames.push("Test Sheet");
  var ws_data = [['hello' , 'world']];
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

  downloadSheet();

  return (
    <div>
      Data Export
    </div>
  )
}

export default DataExport
