// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import FormUserAdd from '@/views/apps/user/add/FormUserAdd'

const AddUser = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <FormUserAdd />
      </Grid>
    </Grid>
  )
}

export default AddUser
