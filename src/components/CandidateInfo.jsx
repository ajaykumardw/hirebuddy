import { IconButton, Tooltip, Typography } from "@mui/material"
import { format } from "date-fns"

const CandidateInfo = ({ info }) => {

  return (
    <Tooltip title={
      <>
      <Typography variant="body2" color="white">
        Interview with: {info?.interview_with || ''}
      </Typography>
      <Typography variant="body2" color="white">
        Job Title: {info?.job_title || ''}
      </Typography>
      <Typography variant="body2" color="white">
        Onboarding status: {info?.onboarding_status || ''}
      </Typography>
      <Typography variant="body2" color="white">
        Invited on: {info?.invited_at ? format(info.invited_at, 'dd MMMM, yyyy') || '' : ''}
      </Typography>
      <Typography variant="body2" color="white">
        Updated on: {info?.updated_at ? format(info.updated_at, 'dd MMMM, yyyy') || '' : ''}
      </Typography>
      </>
    } arrow>
      <IconButton color='info' size='small' className='p-0.5 ml-1' disableRipple>
        <i className='tabler-info-circle' />
      </IconButton>
    </Tooltip>
  )

}

export default CandidateInfo
