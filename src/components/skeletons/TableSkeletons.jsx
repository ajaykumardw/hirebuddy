import { Skeleton } from "@mui/material"

import tableStyles from '@core/styles/table.module.css'

const TableSkeletons = ({ rows = 10, cols = 5 }) => {

  return (
    <table className={tableStyles.table}>
      <thead>
        <tr>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <th key={colIndex}>
              <Skeleton />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: cols }).map((_, colIndex) => (
              <td key={colIndex}>
                <Skeleton />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )

}

export default TableSkeletons
