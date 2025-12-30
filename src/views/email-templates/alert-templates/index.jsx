import  Grid  from "@mui/material/Grid2"

import AlertTemplate from "./AlertTemplate"

const AlertTemplateList = ({templates}) => {
  return (
    <Grid container spacing={6}>
      {templates?.map((template) => (
        <Grid size={{ xs: 12, sm: 6 }} key={template?.id}>
          <AlertTemplate template={template} />
        </Grid>
      ))}
    </Grid>
  )
}

export default AlertTemplateList
