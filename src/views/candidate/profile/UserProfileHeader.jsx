import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { Avatar, IconButton } from '@mui/material'

import { format } from 'date-fns'

const UserProfileHeader = ({ data, setOpenBasicForm }) => {

  const router = useRouter();

  return (
    <Card>
      {/* <CardMedia image={'/images/pages/profile-banner.png'} className='bs-[250px]' /> */}
      <CardContent className='flex gap-5 justify-center flex-col items-center md:items-end md:flex-row md:justify-start'>
        <div className='flex rounded-full  border-[5px]  border-be-0  border-backgroundPaper bg-backgroundPaper'>
          <Avatar sx={{ height: 120, width: 120 }} src={data?.profile_image} />
          {/* <img height={120} width={120} src={data?.profile} className='rounded-full' alt='Profile Background' /> */}
        </div>
        <div className='flex is-full justify-start self-end flex-col items-center gap-6 sm-gap-0 sm:flex-row sm:justify-between sm:items-end '>
          <div className='flex flex-col items-center sm:items-start gap-2'>
            <Typography variant='h4'>{data?.full_name}
              <IconButton onClick={() => setOpenBasicForm(true)} aria-label='edit' color='secondary'>
                <i className='tabler-edit' />
              </IconButton>
            </Typography>
            <div className='flex flex-wrap gap-6 justify-center sm:justify-normal'>
              {data?.profile_title &&
              <div className='flex items-center gap-2'>
                {<i className={'tabler-palette'} />}
                <Typography className='font-medium'>{data?.profile_title}</Typography>
              </div>}
              {data?.city?.city_name &&
              <div className='flex items-center gap-2'>
                <i className='tabler-map-pin' />
                <Typography className='font-medium'>{data?.city?.city_name}</Typography>
              </div>}
              {data?.created_at &&
              <div className='flex items-center gap-2'>
                <i className='tabler-calendar' />
                <Typography className='font-medium'>{data?.created_at && format(data?.created_at, 'MMMM yyyy')}</Typography>
              </div>}
              {data?.date_of_birth &&
              <div className='flex items-center gap-2'>
                <i className='tabler-cake' />
                <Typography className='font-medium'>{data?.date_of_birth && format(data?.date_of_birth, 'do MMMM yyyy')}</Typography>
              </div>}
            </div>
          </div>
          <div className='flex gap-2'>
            <Button
              variant="tonal"
              className="flex gap-2"
              startIcon={<i className="tabler-download" />}
              disabled={!data?.cv}
              {...(data?.cv ? { href: `${process.env.NEXT_PUBLIC_API_URL}/download/${data.cv}` } : {})}
            >
              Resume
            </Button>
            <Button variant='contained' className='flex gap-2' onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </CardContent>

    </Card>
  )
}

export default UserProfileHeader
