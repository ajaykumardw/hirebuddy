'use client'

import { Button, Typography } from "@mui/material"

// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline' // ✅ Success icon

import classNames from 'classnames'

import CustomIconButton from "@/@core/components/mui/IconButton"

const JobAppliedSuccess = () => {
  return (
    <div className="flex items-center justify-center p-6 ">
      <div className="flex flex-col items-center text-center max-w-600px] w-full">
        <CustomIconButton variant="tonal" color='success' size="large" className="!text-[208px] rounded-full">
          <i className="tabler-circle-check"/>
        </CustomIconButton>

        {/* ✅ Success Text */}
        <Typography variant="h4" gutterBottom>
          Thank you for applying!
        </Typography>
        <Typography variant="body1" mb={2}>
          We’ve received your Resume and truly appreciate your interest in this opportunity.
        </Typography>
        <Typography variant="body1" mb={2}>
          Our team will connect with you for the next step.
        </Typography>
        <Typography variant="body1" mb={2}>
          Best Regards,
        </Typography>
        <Typography variant="body1" mb={4}>
          Dream Weavers Recruitment Team
        </Typography>

        {/* ✅ Call to Action */}
        {/* <Button
          href="/candidate/dashboard"
          variant="contained"
          color="primary"
          size="large"
        >
          Go To Dashboard
        </Button> */}
      </div>
    </div>
  )
}

export default JobAppliedSuccess
