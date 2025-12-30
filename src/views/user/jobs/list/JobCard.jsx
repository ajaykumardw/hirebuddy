'use client'

import { useEffect, useRef, useState } from 'react'

import Link from 'next/link'

import { useParams } from 'next/navigation'

import dynamic from 'next/dynamic'

// MUI Imports
import { Avatar, Badge, Button, Card, CardActions, CardContent, CardHeader, Chip, CircularProgress, Divider, Grid2, IconButton, Rating, Skeleton, Tooltip, Typography } from '@mui/material'

import { formatDistanceToNow } from 'date-fns'

import { useKeenSlider } from 'keen-slider/react'


import { useSession } from 'next-auth/react'

import Grid from '@mui/material/Grid2'

import { getLocalizedUrl } from '@/utils/i18n'

import { getInitials } from '@/utils/getInitials'

import MatchedCandidateDialog from '../MatchedCandidateDialog'


import CustomIconButton from '@/@core/components/mui/IconButton'

import CustomChip from '@/@core/components/mui/Chip'
import DialogsConfirmation from '../DialogConfirmation'
import InviteCandidateDialog from '../InviteCandidateDialog'

const JobCard = ({job, isCandidate}) => {

  const [skillRef] = useKeenSlider({
    slides: {
      perView: 'auto',
      loop: false,
      mode: "snap",
      rtl: false,
      spacing: 6
    }
  })

  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  const {data:session, status} = useSession();
  const token = session?.user?.token;
  const authUser = session?.user;
  const userId = session?.user?.id;

  const [openMatchedCandidate, setOpenMatchedCandidate] = useState(false);
  const [openAppliedCandidate, setOpenAppliedCandidate] = useState(false);
  const [openInviteCandidate, setOpenInviteCandidate] = useState(false);
  const [matchedCandidates, setMatchedCandidates] = useState([]);
  const [matchedCandidateLoading, setMatchedCandidateLoading] = useState(false);
  const [openApply, setOpenApply] = useState(false);
  const [openSave, setOpenSave] = useState(false);
  const [tabOpen, setTabOpen] = useState(null);

  const { lang: locale } = useParams()
  const JobDescription = dynamic(() => import('./JobDescription'), { ssr: false });

  useEffect(() => {
    if(userId && job){
      setApplied(job?.candidates?.some((cnd) => cnd?.id === userId))
    }

    if(userId && job){
      setSaved(job?.saved_candidates?.some((cnd) => cnd?.id === userId))
    }
  }, [userId, job])

  const getMatchedCandidates = async () => {

    if(!token || !job.id) return

    setMatchedCandidateLoading(true);

    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/matched-candidates`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if(res.ok){
        const data = await res.json();

        setMatchedCandidates(data?.matched_candidates || []);
      } else {
        setMatchedCandidates([]);
      }
    } catch (error) {
      setMatchedCandidates([]);

    } finally {
      setMatchedCandidateLoading(false);
    }

  }

  const fetchedRef = useRef(false);

  useEffect(() => {
    
    if (job.id && !fetchedRef.current && token) {
      fetchedRef.current = true;
      getMatchedCandidates();
    }
  }, [job.id, token]);

  return (
    <Card variant='outlined'>
      <CardHeader title={job?.job_title}
        subheader={
          <Typography variant='h6'>{job?.company_name}</Typography>
        }
        action={
          <Avatar variant='square' sx={{ width: 50, height: 50}} alt={job?.company_name} src={''} >{getInitials(job?.company_name)}</Avatar>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }} className='flex flex-wrap gap-2'>
            <Chip
              label={
                job?.min_exp === 0 && job?.max_exp === 0
                  ? 'Fresher'
                  : `${job?.min_exp ?? 0}-${job?.max_exp ?? 0} Yrs`
              }
              color='primary'
              variant='contained'
              icon={<i className='tabler-briefcase' />}
            />
            <Chip label={job?.min_ctc && job?.max_ctc ? `${job?.min_ctc}-${job?.max_ctc} Lacs PA` : 'Not disclosed' } color='success' variant='contained' icon={ <i className='tabler-currency-rupee' /> } />
            <Link href={getLocalizedUrl(`/jobs/${job?.id}/view?highlight=locations`, locale)}>
            <Chip
              label={
                Array.isArray(job?.locations) && job.locations.length > 0
                  ? job.locations.length === 1
                    ? job.locations[0].city_name
                    : `${job.locations[0].city_name} +${job.locations.length - 1} more`
                  : ''
              }
              color="warning"
              variant="contained"
              icon={<i className="tabler-map-pin" />}
            />
            </Link>


          </Grid>
          <Grid size={{ xs: 12 }} className='flex items-center gap-2'>
            <div className='flex'>
              <i className='tabler-align-box-left-top text-xl text-textSecondary' />
            </div>
            <JobDescription html={job?.description} />
            {/* <Typography variant='body1' className='overflow-hidden whitespace-nowrap text-ellipsis' dangerouslySetInnerHTML={{ __html: job?.description }} /> */}
          </Grid>
          <Grid ref={skillRef} size={{ xs: 12 }} className='relative keen-slider flex overflow-hidden'>
            {job?.skills?.map((skill, index) => (
              <CustomChip key={index} round='true' size='small' className='keen-slider__slide' label={skill?.name} />
            ))}
            <div className="absolute right-0 top-0 h-full w-4 bg-gradient-to-l from-[var(--mui-palette-background-paper)] pointer-events-none" />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className='justify-between'>
        <Grid container spacing={2} className='flex-1'>
          {!isCandidate && <>
            <Grid size={{ xs: 12 }}>
              <Typography variant='h6'>Matched Candidates</Typography>
              <div className='flex gap-2'>
                { matchedCandidateLoading ?
                  <>
                    <Skeleton variant='rectangular' width={80} height={30} sx={{ borderRadius: 1 }} />
                    <Skeleton variant='rectangular' width={80} height={30} sx={{ borderRadius: 1 }} />
                    <Skeleton variant='rectangular' width={80} height={30} sx={{ borderRadius: 1 }} />
                    <Skeleton variant='rectangular' width={80} height={30} sx={{ borderRadius: 1 }} />
                  </> : <>
                  <Button onClick={() => {setOpenMatchedCandidate(true); setTabOpen('100%')}} variant='contained' color='primary' size='small' className='m-0' disabled={matchedCandidates?.length === 0 || matchedCandidates?.['100%']?.length === 0}>100% ({matchedCandidates?.['100%']?.length || 0})</Button>
                  <Button onClick={() => {setOpenMatchedCandidate(true); setTabOpen('70%')}} variant='contained' color='success' size='small' className='m-0' disabled={matchedCandidates?.length === 0 || matchedCandidates?.['70%']?.length === 0}>70% ({matchedCandidates?.['70%']?.length || 0})</Button>
                  <Button onClick={() => {setOpenMatchedCandidate(true); setTabOpen('50%')}} variant='contained' color='warning' size='small' className='m-0' disabled={matchedCandidates?.length === 0 || matchedCandidates?.['50%']?.length === 0}>50% ({matchedCandidates?.['50%']?.length || 0})</Button>
                  <Button onClick={() => {setOpenMatchedCandidate(true); setTabOpen('30%')}} variant='contained' color='error' size='small' className='m-0' disabled={matchedCandidates?.length === 0 || matchedCandidates?.['30%']?.length === 0}>30% ({matchedCandidates?.['30%']?.length || 0})</Button>
                </>}
              </div>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button onClick={() => {setOpenAppliedCandidate(true)}} variant='contained' color='primary' size='small' className='m-0' disabled={job?.candidates?.length === 0}>Applicants ({job?.candidates?.length})</Button>
            </Grid></>
          }
          <Grid size={{ xs: 12 }} className='flex justify-between items-center gap-2 flex-wrap'>
            <Typography variant='body2' >{formatDistanceToNow(job?.created_at, {addSuffix: true})}</Typography>

            {isCandidate ?
              <div className='flex gap-2 flex-wrap'>
                <Link href={getLocalizedUrl(`/candidate/jobs/${job?.id}/view`, locale)}><CustomIconButton variant='contained' color='success' size='small'><i className='tabler-eye' /></CustomIconButton></Link>
                {applied || <Tooltip title="Save Job"><span><CustomIconButton onClick={() => { if(!saved) {setOpenSave(true)}}} variant={saved ? 'contained' : 'outlined'} color='warning' size='small' disabled={status === 'loading'}>
                  {saved ? <i className='tabler-star-filled' /> : <i className='tabler-star' />}
                </CustomIconButton></span></Tooltip>}
                {applied || <Button className='ml-0' onClick={() => setOpenApply(true)} variant='contained' color='primary' size='small' disabled={status === 'loading' || applied}>
                  {applied ? 'Applied' : 'Apply'}
                </Button>}
              </div>
             :
              <div className='flex gap-2'>
                {authUser?.userType === 'U' &&
                  <Tooltip title="Invite Candidate">
                    <CustomIconButton onClick={() => setOpenInviteCandidate(true)} variant='outlined' color='primary' size='small'><i className='tabler-send' /></CustomIconButton>
                  </Tooltip>
                }
                <Tooltip title="View Job">
                  <Link href={getLocalizedUrl(`${authUser?.userType === 'B' ? `/branch/jobs/${job?.id}/view` : `/jobs/${job?.id}/view`}`, locale)}>
                    <CustomIconButton variant='contained' color='success' size='small'><i className='tabler-eye' /></CustomIconButton>
                  </Link>
                </Tooltip>
                {/* {authUser?.userType !== 'B' &&
                  <Link href={getLocalizedUrl(`/jobs/${job?.id}/edit`, locale)}><CustomIconButton variant='contained' color='primary' size='small'><i className='tabler-edit' /></CustomIconButton></Link>
                } */}
              </div>
            }
          </Grid>
        </Grid>
      </CardActions>
      {openMatchedCandidate && <MatchedCandidateDialog open={openMatchedCandidate} handleClose={() => {setOpenMatchedCandidate(!openMatchedCandidate); setTabOpen(null)}} candidateData={matchedCandidates} jobId={job?.id} selectValue={tabOpen} jobTitle={job?.job_title} />}
      {openAppliedCandidate && <MatchedCandidateDialog open={openAppliedCandidate} handleClose={() => {setOpenAppliedCandidate(!openAppliedCandidate); }} candidateData={job?.candidates} appliedCandidates={true} jobTitle={job?.job_title} />}
      <DialogsConfirmation open={openApply} jobId={job?.id} token={token} applied={applied} setApplied={setApplied} handleClose={() => setOpenApply(!openApply)} />
      <DialogsConfirmation isSave={true} open={openSave} jobId={job?.id} token={token} saved={saved} applied={applied} setSaved={setSaved} handleClose={() => setOpenSave(!openSave)} />
      <InviteCandidateDialog open={openInviteCandidate} handleClose={() => setOpenInviteCandidate(!openInviteCandidate)} jobId={job?.id} />
    </Card>
  )
}

export default JobCard
