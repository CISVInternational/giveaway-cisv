import { useSelector } from "react-redux"
import { getPrograms } from "../../redux/selectors/general.selector"
import "./DataExport.css"
import XLSX from "xlsx"
import { saveAs } from 'file-saver';

const DataExport = () => {
  const programs = useSelector(getPrograms);

  function downloadSheet() {

    let wb = XLSX.utils.book_new();

    wb.Props = {
      Title: "SheetJS Workbook",
      Subject: "Sorteo de destinos",
      Author: "CISV International Dev Team",
      CreatedDate: new Date()
    };
    wb.SheetNames.push("Resultados");

    const header = generateHeader();
    var ws_data = [header];

    for (let programKey in programs) {
      const program = programs[programKey];
      for (let winnerKey in program.winners) {
        const winners = program.winners[winnerKey].map((winner: any) => {
          return program.participants.find((participant: any) => participant.random === winner.random)['nombre y apellidos'];
        });
        const line = [programKey, winnerKey, ...winners];
        ws_data.push(line);
      }
      const waitingLines = program.waitingList.reduce((acc: any, curr: any) => {
        const name = curr['nombre y apellidos'];
        curr.sexo === 'f' ? acc[0].push(name) : acc[1].push(name);
        return acc;
      }, [[programKey, 'WAITING LIST F'], [programKey, 'WAITING LIST M']]);
      ws_data.push(...waitingLines);
    }

    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets["Resultados"] = ws;
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'test.xlsx');
  }

  function generateHeader(): any[] {
    let header = ['Programa', 'Destino'];

    const maxParticipants = Object.keys(programs).reduce((acc, key) => {
      const program = programs[key];
      Object.values(program.winners).forEach((value: any) => {
        acc = Math.max(acc, value.length);
      })
      return acc;
    }, 0);

    for (var i = 0; i < maxParticipants; i++) {
      header.push(`Participante ${i + 1}`);
    }
    return header;
  }

  function s2ab(s: string) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
  }

  return (
    <div>
      <button onClick={() => downloadSheet()}>Download results</button>
    </div>
  )
}

export default DataExport
