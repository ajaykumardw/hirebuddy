// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import HOListTable from './UserListTable'

const HOList = ({ userData }) => {

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <HOListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default HOList
