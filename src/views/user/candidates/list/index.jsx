'use client'

import { useEffect, useState } from 'react';

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import CandidatesListTable from './CandidatesListTable'
import CandidatesListSkeleton from '@/components/skeletons/CandidatesListSkeleton';

const CandidatesList = ({token}) => {

  const [loading, setLoading] = useState(true);
  const [candidatesData, setCandidatesData] = useState([]);

  const getCandidatesData = async () => {
    // Vars
    try {
      // const token = await getCookie('token');

      if (!token) {
        setCandidatesData([])

        return
      }

      setLoading(true) // start loading

      // const session = await getServerSession(authOptions);
      // const token = session?.user?.token;


      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if(res.ok) {
        const data = await res.json();

        setCandidatesData(data.data || [])

      } else {
        setCandidatesData([])
      }


    } catch (error) {
      console.error('Error fetching user data:', error);

      setCandidatesData([])
    } finally {
      setLoading(false) // always stop loading
    }
  }

  useEffect(() => {
    getCandidatesData();
  }, [token])

  if(loading) {
    return <CandidatesListSkeleton />
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CandidatesListTable tableData={candidatesData} />
      </Grid>
    </Grid>
  )
}

export default CandidatesList
