'use client'

import { useEffect, useState } from "react";

import Grid from "@mui/material/Grid2";

import { useSession } from "next-auth/react";

import { Autocomplete, Avatar, Button, Card, CardContent, Divider, TextField, Typography } from "@mui/material";

import { toast } from "react-toastify";

import JobCard from "./JobCard";

import { yearsOpt } from "@/configs/customDataConfig";
import JobSearchForm from "../JobSearchForm";
import CardSkeletons from "@/components/skeletons/CardSkeletons";

// import { useRouter, useSearchParams } from "next/navigation";

const JobsListCard = ({ jobs, branchData, isCandidate, hideSearch }) => {

  const [jobsData, setJobsData] = useState(jobs || []);
  const [industry, setIndustry] = useState('')
  const [experience, setExperience] = useState('')
  const [status, setStatus] = useState('')
  const [industries, setIndustries] = useState(null);
  const [departments, setExperiences] = useState(null);
  const [searching, setSearching] = useState(false);
  const { data: session } = useSession()
  const token = session?.user?.token

  // useEffect(() => {
  //   const filteredData = tableData?.filter(candidate => {
  //     if (industry && candidate.industry_id != industry) return false
  //     if (department && candidate.department_id != department) return false
  //     if (status && candidate.status != status) return false

  //     return true
  //   })

  //   setData(filteredData || [])
  // }, [industry, department, status, tableData, setData])

  useEffect(() => {

    if(!token) return

    const getIndustry = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/industry`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const jsonData = await response.json();

        setIndustries(jsonData?.industries || []);
        setExperiences(jsonData?.departments || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        setIndustries(null);
      }
    }

    getIndustry()
  }, [token])

  useEffect(() => {

    // Ensure DOM is painted before showing toasts
    const runAfterMount = () => {
      const success = sessionStorage.getItem('success');
      const error = sessionStorage.getItem('error');

      if (success) {
        toast.success(success, {
          autoClose: 10000,
          hideProgressBar: false,
        });
        sessionStorage.removeItem('success');
      }

      if (error) {
        toast.error(error, {
          autoClose: 10000,
          hideProgressBar: false,
        });
        sessionStorage.removeItem('error');
      }
    };

    // Run after paint
    requestAnimationFrame(() => {
      setTimeout(runAfterMount, 0);
    });
  }, []);

  const jobData = [
    {
      id: 1,
      job_title: "Junior Backend Engineer",
      company_name: "Tinvio Digital Services",
      location: "",
      experience: "",
      salary: "",
      description: "<p>We are looking for a highly technical and detail-oriented Engineer (Fresher) to ensure the developing and reliability of our software applications. The ideal candidate should have a strong development knowledge and a keen interest in development.</p>",
      skills: [],
      created_at: "2025-06-10T12:34:56.000000Z"
    },

    // {
    //   id: 2,
    //   job_title: "Senior Frontend Developer",
    //   company_name: "Tech Innovations Inc.",
    //   location: "Noida - Sector 62",
    //   experience: "3-5 Yrs",
    //   salary: "80,000 - 100,000",
    //   description: "Looking for an experienced Frontend Developer with a passion for creating dynamic user interfaces and a strong understanding of modern JavaScript frameworks.",
    //   skills: ["React", "Vue.js", "JavaScript", "CSS", "HTML"],
    //   created_at: "2025-06-10T12:34:56.000000Z"
    // },
    // {
    //   id: 3,
    //   job_title: "Data Scientist",
    //   company_name: "Data Insights Ltd.",
    //   location: "New Delhi - Nehru Place",
    //   experience: "2-4 Yrs",
    //   salary: "90,000 - 120,000",
    //   description: "Seeking a Data Scientist to analyze complex datasets and provide actionable insights to drive business decisions.",
    //   skills: ["Python", "R", "Machine Learning", "SQL", "Data Visualization"],
    //   created_at: "2025-06-12T02:34:56.000000Z"
    // }

    // Add more job objects as needed

  ];

  return (
    <Grid container spacing={6}>
      <Card style={{ width: '100%' }}>
        <Grid size={{ xs: 12 }}>
          <CardContent>
            {!hideSearch &&
              <JobSearchForm yearsOpt={yearsOpt} setJobsData={setJobsData} isCandidate={isCandidate} searching={searching} setSearching={setSearching} />
            }
            {/* <Grid container spacing={6}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField fullWidth label='Enter keyword / designation / companies' size='small'/>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Autocomplete
                  fullWidth
                  size='small'
                  options={yearsOpt || []}
                  filterOptions={(option) => option?.filter(opt => opt.value !== '31') || []}
                  getOptionLabel={(year) => year?.value == '0' ? 'Fresher (less than 1 year)' : year?.label || ''}
                  value={yearsOpt && yearsOpt.find(opt => opt.id === experience) || null}
                  onChange={(event, value) => {
                    setExperience(value?.id || '');
                  }}
                  getOptionKey={(option => option?.value)}
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  renderInput={(params) => (
                    <TextField label='Select experience' {...params}/>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField fullWidth label='Enter location' size='small' />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }} className='flex justify-end'>
                <Button variant='tonal'>Search</Button>
              </Grid>
            </Grid> */}
          </CardContent>
        </Grid>
        <Divider />
        <Grid size={{ xs: 12 }}>
          <CardContent>
            {searching ?
              <CardSkeletons totalCards={3} />
              :
              <Grid container spacing={6}>
              {jobsData?.length <= 0 ?
                <Grid size={{ xs: 12 }}>
                  <div className="flex flex-col items-center py-10">
                    <Avatar sx={{ width: 56, height: 56, mb: 2 }}>
                      <i className='tabler-report'></i>
                    </Avatar>
                    <Typography color="text.secondary">No data found</Typography>
                  </div>
                </Grid>
                : jobsData?.map((job, index) => (
                  <Grid key={index} size={{ xs: 12, sm: 12, md: 6, xl: 4 }}>
                    <JobCard job={job} branchData={branchData} isCandidate={isCandidate} setJobsData={setJobsData} />
                  </Grid>
                ))}
              </Grid>
            }
          </CardContent>
        </Grid>
      </Card>
    </Grid>
  )
}

export default JobsListCard;
