import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { Avatar, IconButton, Skeleton } from '@mui/material'

import { format } from 'date-fns'

const UserProfileHeaderSkeleton = ({ animation = 'pulse' }) => {

  return (
    <Card>
      <CardMedia image={'/images/pages/profile-banner.png'} className='bs-[250px]' />
      <CardContent className='flex gap-5 justify-center flex-col items-center md:items-end md:flex-row !pt-0 md:justify-start'>
        <div className='flex rounded-full mbs-[-40px] border-[5px] mis-[-5px] border-be-0  border-backgroundPaper bg-backgroundPaper'>
          <Skeleton animation={animation} variant='circular' width={120} height={120} />
          {/* <Avatar sx={{ height: 120, width: 120 }} src={data?.profile_image} /> */}
          {/* <img height={120} width={120} src={data?.profile} className='rounded-full' alt='Profile Background' /> */}
        </div>
        <div className='flex is-full justify-start self-end flex-col items-center gap-6 sm-gap-0 sm:flex-row sm:justify-between sm:items-end '>
          <div className='flex flex-col items-center sm:items-start gap-2'>
            <Skeleton animation={animation} variant='rectangular' width={200} height={40} sx={{ borderRadius: 1 }} />
            <div className='flex flex-wrap gap-6 justify-center sm:justify-normal'>
              <Skeleton animation={animation} width={150} />
              <Skeleton animation={animation} width={150} />
              <Skeleton animation={animation} width={150} />
              {/* <Skeleton variant='rectangular' width={150} height={30} sx={{ borderRadius: 1 }} />
              <Skeleton variant='rectangular' width={150} height={30} sx={{ borderRadius: 1 }} /> */}
            </div>
          </div>
          <div className='flex gap-2'>
            <Skeleton animation={animation} variant='rectangular' width={120} height={40} sx={{ borderRadius: 1 }} />
            <Skeleton animation={animation} variant='rectangular' width={120} height={40} sx={{ borderRadius: 1 }} />
          </div>
        </div>
      </CardContent>

    </Card>
  )

}

export default UserProfileHeaderSkeleton
