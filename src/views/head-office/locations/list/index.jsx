// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import LocationListTable from './LocationListTable'

const LocationList = ({ locationData, stateData, isAdmin }) => {

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <LocationListTable tableData={locationData} stateData={stateData} isAdmin={isAdmin} />
      </Grid>
    </Grid>
  )
}

export default LocationList
