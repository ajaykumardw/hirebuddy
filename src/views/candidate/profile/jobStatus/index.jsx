'use client'

import { format, parse } from "date-fns";

import { TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from "@mui/lab";

import { Card, CardContent, CardHeader, Divider, IconButton, Typography } from "@mui/material";

import { styled } from '@mui/material/styles'

import MuiTimeline from '@mui/lab/Timeline'

// Styled Components
const Timeline = styled(MuiTimeline)({
  '& .MuiTimelineItem-root': {
    '&:before': {
      display: 'none'
    }
  }
})

const JobStatus = ({ data }) => {

  return (
    <Card>
      <CardHeader className="bg-primary white" title={<Typography variant="h5" className="text-white">Jobs Onboarding Details</Typography>} />
      <Divider />
      <CardContent sx={{ maxHeight: 390, overflowY: 'auto' }}>
        <Timeline>
          {data?.map((info, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot color={'primary'} />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <div className='flex items-center justify-between flex-wrap gap-x-4 pbe-[7px]'>
                  <Typography className='text-textPrimary font-medium'>Job Title: {info?.job_title}</Typography>
                  <div>
                    <Typography variant='caption'>
                      {info?.invited_at && `Invited On ${format(info?.invited_at, 'dd MMM, yy')}`}
                    </Typography>
                  </div>
                  {info?.updated_at &&
                  <div>
                    <Typography variant='caption'>
                      {info?.updated_at && `Updated On ${format(info?.updated_at, 'dd MMM, yy')}`}
                    </Typography>
                  </div>
                  }
                </div>
                <Typography className='mbe-2'>Company: {info?.interview_with}</Typography>
                <Typography className='mbe-2'>Status: {info?.onboarding_status}</Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );

}

export default JobStatus
