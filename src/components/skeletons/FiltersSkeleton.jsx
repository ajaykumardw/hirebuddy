
import { Card, CardContent, CardHeader, Divider, Skeleton } from '@mui/material';

import Grid from '@mui/material/Grid2';

const FiltersSkeleton = ({title = false}) => {
  return (
    <>
      {title &&
      <CardHeader title={<Skeleton variant='rectangular' width={150} height={30} sx={{ borderRadius: 1 }} />} className='pbe-4'/>
      }
      <CardContent>
        <Grid container spacing={6}>
          <Grid size={{ xs:12, sm:6, md: 3 }}>
            <Skeleton variant='rectangular' height={35} sx={{ borderRadius: 1 }} />
          </Grid>
          <Grid size={{ xs:12, sm:6, md: 3 }}>
            <Skeleton variant='rectangular' height={35} sx={{ borderRadius: 1 }} />
          </Grid>
          <Grid size={{ xs:12, sm:6, md: 3 }}>
            <Skeleton variant='rectangular' height={35} sx={{ borderRadius: 1 }} />
          </Grid>
          <Grid size={{ xs:12, sm:6, md: 3 }}>
            <Skeleton variant='rectangular' height={35} sx={{ borderRadius: 1 }} />
          </Grid>
          <Grid size={{ xs:12 }}>
            <Skeleton variant='rectangular' width={100} height={35} sx={{ marginLeft: 'auto', borderRadius: 1 }} />
          </Grid>
        </Grid>
      </CardContent>
    </>
  )
}

export default FiltersSkeleton
