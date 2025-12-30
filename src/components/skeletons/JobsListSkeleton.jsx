import React from 'react';

import { Card, CardContent, Divider, Skeleton } from '@mui/material';

import Grid from '@mui/material/Grid2';

import CardSkeletons from './CardSkeletons';

const JobsListSkeleton = ({totalCards = 4}) => {

  const maxCards  = 12;
  const cardCounts = Math.min(totalCards, maxCards);

  return (
    <Grid container spacing={6}>
      <Card style={{ width: '100%' }}>
        <Grid size={{ xs: 12 }}>
          <CardContent>
            {/* {!hideSearch &&
              <JobSearchForm yearsOpt={yearsOpt} setJobsData={setJobsData} isCandidate={isCandidate} />
            } */}
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
        </Grid>
        <Divider />
        <Grid size={{ xs: 12 }}>
          <CardContent>
            <CardSkeletons totalCards={cardCounts} />
          </CardContent>
        </Grid>
      </Card>
    </Grid>
  );
}

export default JobsListSkeleton;
