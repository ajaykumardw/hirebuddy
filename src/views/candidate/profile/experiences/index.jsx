'use client'

import { format, isValid, parse } from "date-fns";

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

const Experience = ({ data, setOpenExpForm }) => {

  // console.log("experience:", data);

  // function getAllMonths(start, end) {
  //   const months = [];
  //   const formats = ['dd-MM-yyyy', 'MM-yyyy', 'yyyy-MM-dd', 'yyyy-MM'];

  //   const parsedStartDate = formats.reduce((acc, format) => {
  //     const parsed = parse(start, format, new Date());

  //     return isNaN(parsed) ? acc : parsed;
  //   }, new Date());

  //   const parsedEndDate = end && end != 'current_time' ? formats.reduce((acc, format) => {
  //     const parsed = parse(end, format, new Date());

  //     return isNaN(parsed) ? acc : parsed;
  //   }, new Date()) : new Date();

  //   const date = new Date(parsedStartDate);

  //   while (date <= parsedEndDate) {
  //     months.push(format(date, 'yyyy-MM'));
  //     date.setMonth(date.getMonth() + 1);
  //   }

  //   return months;
  // }

  function getAllMonths(start, end) {
    const months = [];
    const formats = ['dd-MM-yyyy', 'MM-yyyy', 'yyyy-MM-dd', 'yyyy-MM'];

    // ✅ Early exit if start is missing
    if (!start) {

      // console.error('Start date is required');

      return months;
    }

    // ✅ Parse start date
    const parsedStartDate = formats.reduce((acc, format) => {
      const parsed = parse(start, format, new Date());

      return isValid(parsed) ? parsed : acc;
    }, null);

    if (!parsedStartDate) {

      // console.error('Invalid start date:', start);

      return months;
    }

    // ✅ Parse end date or use current date
    const parsedEndDate =
      end && end !== 'current_time'
        ? formats.reduce((acc, format) => {
            const parsed = parse(end, format, new Date());

            return isValid(parsed) ? parsed : acc;
          }, null)
        : new Date();

    if (!parsedEndDate) {

      // console.error('Invalid end date:', end);

      return months;
    }

    const date = new Date(parsedStartDate);

    while (date <= parsedEndDate) {
      months.push(format(date, 'yyyy-MM'));
      date.setMonth(date.getMonth() + 1);
    }

    return months;
  }

  const totalExperience = (job) => {

    const monthSet = new Set();

    getAllMonths(job.start_date, job.end_date).forEach(m => monthSet.add(m));

    const totalMonths = monthSet.size;
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    // console.log("total months:", totalMonths, monthSet);

    // Format the result as "X years Y months"
    let formattedDuration = '';

    if (years > 0) {

      formattedDuration += `${years} year${years > 1 ? 's' : ''}`;
    }

    if (months > 0) {

      if (years > 0) {
        formattedDuration += ' '; // Add space if both years and months are included
      }

      formattedDuration += `${months} month${months > 1 ? 's' : ''}`;
    }

    return formattedDuration

  }

  return (
    <Card>
      <CardHeader title='Experiences' action={
        <IconButton onClick={() => setOpenExpForm(true)} aria-label='Edit' color='secondary'>
          <i className='tabler-edit' />
        </IconButton>
      } />
      <Divider />
      <CardContent sx={{ maxHeight: 328, overflowY: 'auto' }}>
        <Timeline>
          {data?.map((job, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot color={job?.is_current === 1 ? 'success' : 'error'} />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <div className='flex items-center justify-between flex-wrap gap-x-4 pbe-[7px]'>
                  <Typography className='text-textPrimary font-medium'>{job?.job_title}</Typography>
                  <Typography variant='caption'>
                    {
                      totalExperience(job)
                    }
                  </Typography>
                </div>
                <Typography className='mbe-2'>{job?.company_name}</Typography>
                <Typography className='mbe-2'>{job?.start_date && format(job?.start_date, 'MMM yyyy')} to {job?.is_current == 1 ? 'Present' : (job?.end_date && format(job?.end_date, 'MMM yyyy'))}</Typography>
                <Typography className='mbe-2'>{job?.location}</Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );

}

export default Experience
