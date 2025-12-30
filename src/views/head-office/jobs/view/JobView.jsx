'use client'

import { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import dynamic from "next/dynamic";

import { useSession } from "next-auth/react";

import Grid from "@mui/material/Grid2";

import { Avatar, Button, Card, CardContent, CircularProgress, Divider, Typography } from "@mui/material"

import { formatDistanceToNow } from "date-fns";

import { getInitials } from "@/utils/getInitials"

import CustomChip from "@/@core/components/mui/Chip";
import DialogsConfirmation from "../DialogConfirmation";
import CustomIconButton from "@/@core/components/mui/IconButton";
import { getLocalizedUrl } from "@/utils/i18n";
import SourceCriteriaDialog from "@/components/SourceCriteriaDialog";

import { qualificationData } from "@/configs/customDataConfig";

const JobView = ({ job, isCandidate }) => {

  const [applied, setApplied] = useState(false);
  const [openApply, setOpenApply] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openSave, setOpenSave] = useState(false);
  const [openSourceCriteria, setOpenSourceCriteria] = useState(false);

  const {data: session, status} = useSession();
  const token = session?.user?.token;
  const userId = session?.user?.id;

  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightParam = searchParams.get("highlight") || searchParams.get("hightight");
  const highlight = highlightParam?.toLowerCase()?.trim();

  useEffect(() => {
    if(userId && job){
      setApplied(job?.candidates?.some((cnd) => cnd?.id === userId))
    }

    if(userId && job){
      setSaved(job?.saved_candidates?.some((cnd) => cnd?.id === userId))
    }
  }, [userId, job])

  const JobDescription = dynamic(() => import('../list/JobDescription'), { ssr: false });

  return (
    <Card>
      <CardContent>
        {job &&
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <div className="flex gap-3 justify-between flex-wrap">
                <div className="flex-1">
                  <Typography variant="h5" className='flex gap-2'>Openings: <div className='text-[var(--mui-palette-text-primary)]'>{job?.total_positions}</div></Typography>
                </div>
                <Button disabled={!job?.source_criteria} variant='contained' className='flex gap-2' onClick={() => setOpenSourceCriteria(true)}>
                  Source Criteria
                </Button>
                <Button variant='contained' className='flex gap-2' onClick={() => router.back()}>
                  Go Back
                </Button>
              </div>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <div className='flex gap-3 justify-between'>
                <div className='flex-1'>
                  <Typography variant='h4'>
                    {job?.job_title}
                  </Typography>
                  <Typography>
                    {job?.company_name}
                  </Typography>
                </div>
                <div>
                  <Avatar variant='square' sx={{ width: 80, height: 80}} alt={job?.company_name} src={''} >{job?.company_name && getInitials(job?.company_name)}</Avatar>
                </div>
              </div>
            </Grid>
            <Grid size={{ xs: 12 }} className='justify-between flex items-center flex-wrap' gap={3}>
              <div>
                <div className='flex gap-5'>
                  <div className='flex gap-2 items-center'>
                    <i className='tabler-briefcase text-[20px]' />
                    <Typography>{job?.min_exp}-{job?.max_exp} Years</Typography>
                  </div>
                  <Divider orientation='vertical' variant="middle" sx={{ height: '18px' }} />
                  <div className="flex gap-2 items-center">
                    <i className='tabler-currency-rupee text-[20px]' />
                    <Typography>{job?.min_ctc}-{job?.max_ctc} Lacs P.A.</Typography>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <i className='tabler-map-pin text-[20px] max-w-[20px] w-full' />
                  {highlight=='locations' ? <mark>
                    <Typography className="text-black">{job?.locations?.map(loc => loc?.city_name).join(', ')}</Typography>
                    </mark>
                  :
                  <Typography>{job?.locations?.map(loc => loc?.city_name).join(', ')}</Typography>
                  }
                </div>
              </div>
              {isCandidate && <div className='flex gap-2'>
                {!applied && token &&
                  <CustomIconButton onClick={() => { if(!saved) {setOpenSave(true)}}} variant={saved ? 'tonal' : 'outlined'} color='warning' size='small' disabled={status === 'loading'}>
                    {saved ? <i className='tabler-star-filled' /> : <i className='tabler-star' />}
                  </CustomIconButton>

                  // <Button color='primary' size='small' className='gap-2' variant='outlined' onClick={() => setOpenSave(true)} disabled={status === 'loading' || saved}>
                  //   {loading && <CircularProgress size={20} color='inherit' />}
                  //   {saved ? 'Saved' : 'Save'}
                  // </Button>

                }
                {token ?
                <Button color='primary' size='small' className='gap-2' variant='contained' onClick={() => setOpenApply(true)} disabled={status === 'loading' || applied}>
                  {/* {loading && <CircularProgress size={20} color='inherit' />} */}
                  {applied ? 'Applied' : 'Apply'}
                </Button>
                :
                <Button color='primary' className='gap-2' variant='contained' href={getLocalizedUrl(`/candidate/login`, 'en')}>
                  {/* {loading && <CircularProgress size={20} color='inherit' />} */}
                  {applied ? 'Applied' : 'Login to apply'}
                </Button>}
                </div>
              }
            </Grid>
            <Grid size={{ xs:12 }}>
              <Divider />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <div className='flex gap-5 items-center'>
                <Typography variant='h6' className='flex gap-2'>Posted: <div className='text-[var(--mui-palette-text-primary)]'>{job?.created_at && formatDistanceToNow(job?.created_at, {addSuffix: true})}</div></Typography>
                <Divider orientation='vertical' variant="middle" sx={{ height: '18px' }} />
                <Typography variant="h6" className='flex gap-2'>Openings: <div className='text-[var(--mui-palette-text-primary)]'>{job?.total_positions}</div></Typography>
                <Divider orientation='vertical' variant="middle" sx={{ height: '18px' }} />
                <Typography variant="h6" className='flex gap-2'>Applicants: <div className='text-[var(--mui-palette-text-primary)]'>{job?.candidates?.length > 100 ? '100+' : job?.candidates?.length || 0}</div></Typography>
              </div>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant='h5'>Job Description</Typography>
              <JobDescription html={job?.description} full />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant='h5'>Roles and Responsibilities</Typography>
              <JobDescription html={job?.role_responsibility} full></JobDescription>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <div className='flex gap-2'>
                <Typography variant='h6'>Industry Type:</Typography><Typography>{job?.industry?.name}</Typography>
              </div>
              <div className='flex gap-2'>
                <Typography variant='h6'>Department:</Typography><Typography>{job?.department?.name}</Typography>
              </div>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant='h6'>Education</Typography>
              {qualificationData.map((qual, index) => {
                if(job?.education.includes(qual.value)){
                  return (
                    <div key={index}>{qual.label}</div>
                  )
                }
              })}
              {/* {job?.education.map((edu, index) => {
                return (
                  <div key={index}>{edu}</div>
                )
              })} */}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant='h6'>Gender</Typography>
              <Typography className='capitalize'>
                {job?.gender} Candidates
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant='h6'>Key Skills</Typography>
              <div className='flex flex-wrap gap-2 mt-2'>
                {job?.skills?.map((skill, index) => (
                  <CustomChip key={index} round='true' variant='tonal' size='small' label={skill?.name} />
                ))}
              </div>
            </Grid>
            {job?.additional_benefits &&
            <Grid size={{ xs: 12 }}>
              <Typography variant='h6'>Additional Benefits</Typography>
              <JobDescription html={job?.additional_benefits} full></JobDescription>
              {/* <Typography>{job?.additional_benefits}</Typography> */}
            </Grid>}
            <Grid size={{ xs: 12 }}>
              <Typography variant='h5'>About Company</Typography>
              <JobDescription html={job?.about_company} full></JobDescription>
              {/* <Typography>{job?.about_company}</Typography> */}
            </Grid>
          </Grid>
        }
      </CardContent>
      <DialogsConfirmation open={openApply} jobId={job?.id} token={token} applied={applied} setApplied={setApplied} handleClose={() => setOpenApply(!openApply)} />
      <DialogsConfirmation isSave={true} open={openSave} jobId={job?.id} token={token} saved={saved} applied={applied} setSaved={setSaved} handleClose={() => setOpenSave(!openSave)} />
      {openSourceCriteria && <SourceCriteriaDialog open={openSourceCriteria} handleClose={() => setOpenSourceCriteria(false)} data={job?.source_criteria} />}
    </Card>
  )
}

export default JobView
