'use client'

import { useEffect, useState } from 'react';

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
// import CandidatesListTable from './CandidatesListTable'
import JobsListCard from './JobsListCard'
import CardSkeletons from '@/components/skeletons/CardSkeletons';
import JobsListSkeleton from '@/components/skeletons/JobsListSkeleton';


const JobsList = ({token, isCandidate, hideSearch, isApplied}) => {

  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);


  const getJobsData = async () => {
    try {
      if (!token) {
        setJobsData([])

        return
      }

      setLoading(true) // start loading

      if(isCandidate) {

        if(isApplied){
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/jobs/applied`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })

          if (res.ok) {
            const data = await res.json()

            setJobsData(data.data)
          } else {
            setJobsData([])
          }

        } else {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/jobs`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })

          if (res.ok) {
            const data = await res.json()

            setJobsData(data.data)
          } else {
            setJobsData([])
          }
        }
      } else {

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (res.ok) {
          const data = await res.json()

          setJobsData(data.data)
        } else {
          setJobsData([])
        }

      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      setJobsData([])
    } finally {
      setLoading(false) // always stop loading
    }
  }

  useEffect(() => {
    getJobsData();
  }, [token])

  // const jobsData = await getJobsData()

  if(loading) {
    return <JobsListSkeleton totalCards={3}/>
  }


  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <JobsListCard jobs={jobsData} isCandidate={isCandidate} hideSearch={hideSearch} />
      </Grid>
    </Grid>
  )
}

export default JobsList
