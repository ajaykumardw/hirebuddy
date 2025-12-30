'use client'

import { Card, CardHeader, Chip, IconButton, Typography } from "@mui/material"

import { format } from "date-fns";

import tableStyles from '@core/styles/table.module.css'
import { qualificationData } from "@/configs/customDataConfig";

const Education = ({ data, setOpenEduForm }) => {

  // console.log("educations:", data);

  return (
    <Card>
      <CardHeader title='Educations' action={
        <IconButton onClick={() => setOpenEduForm(true)} aria-label='Edit' color='secondary'>
          <i className='tabler-edit' />
        </IconButton>
      } />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead className='uppercase'>
            <tr className='border-be'>
              <th className='leading-6 plb-4 pis-6 pli-2'>Education Level</th>
              <th className='leading-6 plb-4 pli-2'>Degree</th>
              <th className='leading-6 plb-4 pli-2'>Branch or Board</th>
              <th className='leading-6 plb-4 pli-2'>School or Institute</th>
              <th className='leading-6 plb-4 pli-2'>Grade Type</th>
              <th className='leading-6 plb-4 pli-2'>Grade Value</th>
              <th className='leading-6 plb-4 pie-6 pli-2 text-right'>Passing Year</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className='pis-6 pli-2 plb-3'>
                  <div className='flex items-center gap-4'>
                    <div className='flex flex-col'>
                      <Typography color='text.primary'>{row?.education_level ? qualificationData.find(qual => qual.value === row?.education_level)?.label : ''}</Typography>
                    </div>
                  </div>
                </td>
                <td className='pli-2 plb-3'>
                  <div className='flex flex-col'>
                    <Typography color='text.primary'>{row?.degree}</Typography>
                    {/* <Typography variant='body2' color='text.disabled'>
                      {row?.degree}
                    </Typography> */}
                  </div>
                </td>
                <td className='pli-2 plb-3'>
                  <Typography color='text.primary'>{row?.branch_or_board}</Typography>
                </td>
                <td className='pli-2 plb-3'>
                  <Typography color='text.primary'>{row?.school_or_institute}</Typography>
                </td>
                <td className='pli-2 plb-3'>
                  <Typography color='text.primary'>{row?.grade_type}</Typography>
                </td>
                <td className='pli-2 plb-3'>
                  {row?.grade_value && <Chip
                    variant='tonal'
                    size='small'
                    label={row?.grade_value}
                    color='success'
                  />}
                </td>
                <td className='pli-2 plb-3 pie-6 text-right'>
                  <Typography color='text.primary'>{row?.passing_year && format(row?.passing_year, 'MMM yyyy')}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )

}

export default Education
