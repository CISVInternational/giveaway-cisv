import { ReactElement } from "react"
import { JsonCSV } from "../models/csv"

export const parseCSV = (data: any): JsonCSV[] => {
  let result = []
  if (data.length) {
    const header = data[0]
    data.shift()
    result = data.map((element: any) => {
      element = Object.values(element).reduce(
        (accumulator: JsonCSV, value: any, index: number) => {
          accumulator[header[index]] = value
          return accumulator
        },
        {}
      )
      return element
    })
  }
  return result
}

const printRowHeader = (data: any) => {
  return (
    <tr>
      {Object.keys(data[0]).map((header: string, index: number) => {
        return <th key={index}>{header}</th>
      })}
    </tr>
  )
}

const printRowData = (data: JsonCSV[]) => {
  return data.map((participant: JsonCSV, index: number) => {
    return (
      <tr key={index}>
        {Object.values(participant).map((value: string, indexValue: number) => {
          return <td key={indexValue}>{value}</td>
        })}
      </tr>
    )
  })
}

export const printTable = (data: any): ReactElement => {
  return (
    data.length && (
      <div className="table-data">
        <table>
          <thead>{printRowHeader(data)}</thead>
          <tbody>{printRowData(data)}</tbody>
        </table>
      </div>
    )
  )
}
