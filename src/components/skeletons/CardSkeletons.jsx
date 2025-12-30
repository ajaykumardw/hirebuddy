import React from 'react';

import { Skeleton } from '@mui/material';

import Grid from '@mui/material/Grid2';

const CardSkeletons = ({totalCards = 4}) => {

  const maxCards  = 12;
  const cardCounts = Math.min(totalCards, maxCards);

  return (
    <Grid container spacing={6}>
      {Array.from({ length: cardCounts }).map((_, index) => (
        <Grid size={{ xs: 12, sm: 12, md: 6, xl: 4 }} key={index}>
          <Skeleton variant='rectangular' height={400} sx={{ borderRadius: 1 }} />
        </Grid>
      ))}
    </Grid>
  );
}

export default CardSkeletons;
