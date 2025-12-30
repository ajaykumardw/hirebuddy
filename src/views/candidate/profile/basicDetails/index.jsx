'use client'

import { Card, CardContent, Chip, Divider, Typography } from "@mui/material"

const BasicDetails = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <div className='flex flex-col gap-4'>
          <Divider className='uppercase'>About</Divider>
          <div className='flex items-center gap-2'>
            <div className='flex items-center flex-wrap gap-2'>
              <Typography className='font-medium'>
                Full Name:
              </Typography>
              <Typography>{data?.full_name}</Typography>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex items-center flex-wrap gap-2'>
              <Typography className='font-medium'>
                Work Status:
              </Typography>
              <Typography className='capitalize'>{data?.work_status}</Typography>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex items-center flex-wrap gap-2'>
              <Typography className='font-medium'>
                Profile Title:
              </Typography>
              <Typography>{data?.profile_title}</Typography>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex items-center flex-wrap gap-2'>
              <Typography className='font-medium'>
                Industry:
              </Typography>
              <Typography>{data?.industry?.name}</Typography>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex items-center flex-wrap gap-2'>
              <Typography className='font-medium'>
                Department:
              </Typography>
              <Typography>{data?.department?.name}</Typography>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex items-center flex-wrap gap-2'>
              <Typography className='font-medium'>
                Role Category:
              </Typography>
              <Typography>{data?.role_category?.name}</Typography>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex items-center flex-wrap gap-2'>
              <Typography className='font-medium'>
                Job Role:
              </Typography>
              <Typography>{data?.job_role?.name}</Typography>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex items-center flex-wrap gap-2'>
              <Typography className='font-medium'>
                Current CTC:
              </Typography>
              {data?.current_ctc && <Chip size='small' variant='tonal' label={data?.current_ctc} color='success' icon={<i className='tabler-currency-rupee' />} /> }
              {/* <Typography className='flex items-center'><i className='tabler-currency-rupee text-[20px]' />{data?.current_ctc}</Typography> */}
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex items-center flex-wrap gap-2'>
              <Typography className='font-medium'>
                Gender:
              </Typography>
              <Typography>{data?.gender == 'f' ? 'Female' : 'Male'}</Typography>
            </div>
          </div>
          <Divider className='uppercase'>Contacts</Divider>
          <div className='flex items-center gap-2'>
            <div className='flex items-center flex-wrap gap-2'>
              <Typography className='font-medium'>
                Email:
              </Typography>
              <Typography>{data?.email}</Typography>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex items-center flex-wrap gap-2'>
              <Typography className='font-medium'>
                Phone:
              </Typography>
              <Typography>{data?.mobile_no}</Typography>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BasicDetails
