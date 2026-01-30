"use client"

import Grid from '@mui/material/Grid2'
import TeamListTable from './TeamListTable'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import FiltersSkeleton from '@/components/skeletons/FiltersSkeleton'
import TableSkeletons from '@/components/skeletons/TableSkeletons'
import { Card } from '@mui/material'

const TeamList = () => {
  const [loading, setLoading] = useState(true)
  const [teamData, setTeamData] = useState([])

  const { data: session, status } = useSession()
  const token = session?.user?.token

  const getTeamData = async (token) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/team`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!res.ok) return []

      return await res.json()
    } catch (error) {
      console.error('Error fetching team data:', error)
      return []
    }
  }

  useEffect(() => {
    // ⛔ wait until session is ready
    if (status !== 'authenticated') return

    const fetchTeamData = async () => {
      setLoading(true)
      const data = await getTeamData(token)
      setTeamData(data)
      setLoading(false)
    }

    fetchTeamData()
  }, [status, token])

  if (loading || status === 'loading') {

    return (
      <Card style={{ width: '100%' }}>
        <FiltersSkeleton title={true} />
        <TableSkeletons />
      </Card>
    )

  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <TeamListTable userData={teamData} />
      </Grid>
    </Grid>
  )
}

export default TeamList
