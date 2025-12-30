// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const TableFilters = ({ setData, tableData }) => {
  // States
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const filteredData = tableData?.filter(user => {
      if (status && user?.status.toString() !== status) return false

      return true
    })

    setData(filteredData || [])
  }, [role, plan, status, tableData, setData])

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-status'
            value={status}
            onChange={e => setStatus(e.target.value)}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>Select Status</MenuItem>
            <MenuItem value='1'>Active</MenuItem>
            <MenuItem value='0'>Inactive</MenuItem>
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
