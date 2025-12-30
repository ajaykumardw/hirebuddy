import dynamic from "next/dynamic";

import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Typography } from "@mui/material";

import Grid from "@mui/material/Grid2";

import DialogCloseButton from "./dialogs/DialogCloseButton";

import { qualificationData, yearsOpt } from "@/configs/customDataConfig";

const SourceCriteriaDialog = ({ open, handleClose, data }) => {

  const JobDescription = dynamic(() => import("@/views/head-office/jobs/list/JobDescription"), { ssr: false });

  return (
    <Dialog open={open} onClose={handleClose}
      maxWidth='md'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleClose}>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle>Source Criteria</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12 }}>
            <Typography variant='body2' className='font-medium'>
              1. Experience
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h6">Min Experience: {yearsOpt.find(year => year.value === data?.min_exp?.toString())?.label || 0}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h6">Max Experience: {yearsOpt.find(year => year.value === data?.max_exp?.toString())?.label || 0}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant='body2' className='font-medium'>
              2. Preferred Industry
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <JobDescription html={data?.preferred_industry} full />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant='body2' className='font-medium'>
              3. Educational Qualification
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h6">Min. Qualification: {qualificationData.find(qual => qual.value === data?.min_qualification)?.label}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant='body2' className='font-medium'>
              4. Age Criteria
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h6">Min. Age: {data?.min_age}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h6">Max. Age: {data?.max_age}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant='body2' className='font-medium'>5. Key Skills - Keywords</Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <div className="flex gap-2 flex-wrap">
              {data?.skills_list.map(skill => (
                <Chip variant="outlined" size="small" color="primary" key={skill.id} label={skill.name} />
              ))}
            </div>

            {/* <JobDescription html={data?.skills_list} full /> */}
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant='body2' className='font-medium'>6. Companies to source from</Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <JobDescription html={data?.company_source} full />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h6">Min. Salary: {data?.min_salary ? `₹${data?.min_salary} LPA` : ''}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h6">Max. Salary: {data?.max_salary ? `₹${data?.max_salary} LPA` : ''}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant='body2' className='font-medium'>7. Increment Criteria (in %)</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h6">Min. Increment: {data?.min_increment ? `${data?.min_increment}%` : ''}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h6">Max. Increment: {data?.max_increment ? `${data?.max_increment}%` : ''}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default SourceCriteriaDialog;
