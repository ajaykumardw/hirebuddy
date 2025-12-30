import React from 'react';

import { Card, CardContent, CardHeader, Divider, Skeleton } from '@mui/material';

import Grid from '@mui/material/Grid2';

import CardSkeletons from './CardSkeletons';
import FiltersSkeleton from './FiltersSkeleton';
import TableSkeletons from './TableSkeletons';

const CandidatesListSkeleton = ({totalCards = 4}) => {

  const maxCards  = 12;
  const cardCounts = Math.min(totalCards, maxCards);

  return (
    <Card style={{ width: '100%' }}>
      <FiltersSkeleton title={true} />
      <TableSkeletons />
    </Card>
  )

}

export default CandidatesListSkeleton;
