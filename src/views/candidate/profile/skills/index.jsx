'use client'

import { Card, CardContent, CardHeader, Chip, Divider, IconButton } from "@mui/material"

const Skills = ({ data, setOpenSkillForm }) => {

  return (
    <Card>
      <CardHeader title='Skills' action={
        <IconButton onClick={() => setOpenSkillForm(true)} aria-label='Edit' color='secondary'>
          <i className='tabler-edit' />
        </IconButton>
      }/>
      <Divider />
      <CardContent>
        <div className='flex gap-2 flex-wrap'>
          {data?.map((skill, index) => (
            <Chip color='info' variant='tonal' label={skill?.name} key={index}/>
          ))}
        </div>
      </CardContent>
    </Card>
  )

}

export default Skills
