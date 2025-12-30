'use client'


// React Imports
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'


// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'

import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { Autocomplete, Checkbox, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, Tab, Typography } from '@mui/material'

// Components Imports

import { useSession } from 'next-auth/react'

import { toast } from 'react-toastify'


import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

const SkillForm = ({setData, open, data, skillsData, handleClose}) => {
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const token = session?.user?.token

  const { control, handleSubmit, watch, reset, setValue, setError, formState: { errors } } = useForm({

    values: {
      skills: data?.map(skill => skill?.id) || [],
    }
  });

  const onSubmit = async (data) => {

    setLoading(true);

    if(token){

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/profile/skill`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if(res.ok){


        setData(result.data);

        toast.success(result.message, {
          autoClose: 10000,
          hideProgressBar: false,
        });

        handleClose();

        reset();


      } else if(res.status == 422) {

        // Laravel returns validation errors in the `errors` object
        Object.entries(result.errors).forEach(([field, messages]) => {
          setError(field, {
            type: 'custom',
            message: messages[0], // Use the first error message for each field
          });
        });

      } else {

        handleClose();
        toast.error(result.message, {
          autoClose: 10000,
          hideProgressBar: false,
        });

        reset();

      }
    }

    setLoading(false)
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='md'
      scroll='body'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={() => {handleClose(); reset() }} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex flex-col gap-2 text-center p-6 '>
        Skills
        <Typography>Mention skills like programming languages (Java, Python), softwares (Microsoft Word, Excel) and more, to show your technical expertise.</Typography>
      </DialogTitle>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible p-6 '>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <Controller
                control={control}
                name='skills'
                rules={{
                  required: 'This field is required.',
                }}
                render={({ field }) => (
                  <Autocomplete
                    fullWidth
                    multiple
                    disableCloseOnSelect
                    options={skillsData || []}
                    value={skillsData?.filter(option => field.value?.includes(option.id)) || []}
                    getOptionLabel={(option) => option.name || ''}
                    onChange={(event, newValue) => {
                      field.onChange(newValue.map(option => option.id));
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const tagProps = getTagProps({ index });
                        const { key, ...rest } = tagProps;

                        return <Chip label={option.name} key={key} {...rest} />;
                      })
                    }
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        error={!!errors?.skills}
                        helperText={errors?.skills?.message}
                        label={<>Skills <span className='text-error'>*</span></>}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button type='submit' variant='contained' className='mie-2 gap-2' disabled={loading}>
            {loading && <CircularProgress size={20} color='inherit' />}
            Submit
          </Button>
          <Button type='reset' variant='tonal' color='secondary' onClick={() => { handleClose(); reset() }}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default SkillForm
