'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

import { Skeleton } from '@mui/material'

// Component Imports
import UserProfileHeader from './UserProfileHeader'
import BasicDetailForm from './forms/BasicDetailForm'
import Experience from './experiences'
import ExperienceForm from './forms/ExperienceForm'
import Education from './educations'
import EducationForm from './forms/EducationForm'
import Skills from './skills'
import SkillForm from './forms/SkillForm'

import BasicDetails from './basicDetails'

import JobStatus from './jobStatus'

import UserProfileHeaderSkeleton from '@/components/skeletons/UserProfileHeaderSkeleton'

const UserProfile = ({ tabContentList, data, token, id, isCandidate }) => {

  // States
  const [openBasicForm, setOpenBasicForm] = useState(false);
  const [openExpForm, setOpenExpForm] = useState(false);
  const [openEduForm, setOpenEduForm] = useState(false);
  const [openSkillForm, setOpenSkillForm] = useState(false);
  const [allData, setData] = useState(data);
  const [loading, setLoading] = useState(true);
  const [loadingExperience, setLoadingExperience] = useState(true);
  const [loadingEducation, setLoadingEducation] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [candidate, setCandidateData] = useState(null);

  const animation = 'wave';

  const getProfileData = async () => {
    try {
      if (!token) return;

      // Determine URL based on candidate or not
      const url = isCandidate
        ? `${process.env.NEXT_PUBLIC_API_URL}/candidate/profile`
        : `${process.env.NEXT_PUBLIC_API_URL}/candidates/${id}/view`;

      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = res.ok ? await res.json() : null;

      setData(data || null);

    } catch (error) {
      console.error('Error fetching profile data:', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(token){
      getProfileData();
    }
  }, [token])

  // console.log("all data:", allData);

  if(loading) {

    return (
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <UserProfileHeaderSkeleton animation={animation} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 5, lg: 4 }}>
              <Skeleton animation={animation} variant='rectangular' height={420} sx={{ borderRadius: 1 }} />
            </Grid>
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
              <Skeleton animation={animation} variant='rectangular' height={420} sx={{ borderRadius: 1 }} />
            </Grid>
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
              <Skeleton animation={animation} variant='rectangular' height={420} sx={{ borderRadius: 1 }} />
            </Grid>
            <Grid size={{ xs: 12, md: 5, lg: 4 }}>
              <Skeleton animation={animation} variant='rectangular' height={420} sx={{ borderRadius: 1 }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserProfileHeader data={allData?.candidate} setOpenBasicForm={setOpenBasicForm} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <BasicDetails data={allData?.candidate} />
          </Grid>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <Experience data={allData?.candidate?.experiences} setOpenExpForm={setOpenExpForm} />
          </Grid>
          <Grid size={{ xs: 12, md: 7, lg: 8 }}>
            <Education data={allData?.candidate?.educations} setOpenEduForm={setOpenEduForm} />
          </Grid>
          <Grid size={{ xs: 12, md: 5, lg: 4 }}>
            <Skills data={allData?.candidate?.skills} setOpenSkillForm={setOpenSkillForm} />
          </Grid>
          {!isCandidate && allData?.candidate?.status_info?.length > 0 && (
            <Grid size={{ xs: 12, md: 5, lg: 4 }}>
              <JobStatus data={allData?.candidate?.status_info} />
            </Grid>
          )}
        </Grid>
      </Grid>

      <BasicDetailForm data={allData?.candidate} setData={setData} industries={allData?.industries} departments={allData?.departments} open={openBasicForm} handleClose={() => setOpenBasicForm(!openBasicForm)} isCandidate={isCandidate} />
      <ExperienceForm data={allData?.candidate?.experiences} setData={setData} open={openExpForm} handleClose={() => setOpenExpForm(!openExpForm)} isCandidate={isCandidate} />
      <EducationForm data={allData?.candidate?.educations} setData={setData} open={openEduForm} handleClose={() => setOpenEduForm(!openEduForm)} isCandidate={isCandidate} />
      <SkillForm data={allData?.candidate?.skills} setData={setData} open={openSkillForm} handleClose={() => setOpenSkillForm(!openSkillForm)} skillsData={allData?.skills} isCandidate={isCandidate} />
    </Grid>
  )
}

export default UserProfile
