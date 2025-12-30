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

import { Autocomplete, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, Tab, Typography } from '@mui/material'

// Components Imports
import classNames from 'classnames'


import { useSession } from 'next-auth/react'

import { toast } from 'react-toastify'

import { format, parse } from 'date-fns'

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

import CustomTextField from '@core/components/mui/TextField'

const ExperienceForm = ({setData, open, data, handleClose}) => {

  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const token = session?.user?.token



  const { control, handleSubmit, watch, reset, setValue, setError, formState: { errors } } = useForm({

    values: {
      experiences: data?.length > 0
      ? data.map((exp) => ({
          id: exp.id || null,
          company: exp.company_name || '',
          jobTitle: exp.job_title || '',
          location: exp.location || '',
          startDate: exp.start_date ? new Date(exp.start_date) : null,
          endDate: exp.end_date ? new Date(exp.end_date) : null,
          isCurrent: exp.is_current || false
        }))
      : [
        {
          company: '',
          jobTitle: '',
          location: '',
          startDate: null,
          endDate: null,
          isCurrent: false
        }
      ],
    }
  });

  const { fields: experienceField, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: 'experiences',
  });

  const onSubmit = async (data) => {

    setLoading(true);

    // Filter out completely blank experiences
    const filteredExperiences = data.experiences?.filter(exp =>
      exp.jobTitle || exp.company || exp.location || exp.startDate
    ) || [];

    const payload = {
      ...data,
      experiences: filteredExperiences
    };

    if(token){

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/profile/experience`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if(res.ok){


        setData(result.data);

        toast.success(result.message, {
          autoClose: 10000,
          hideProgressBar: false,
        });

        // fetchData();

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
        // sessionStorage.setItem('error', result.message);

        // router.push('/candidates/list');
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
      maxWidth='xl'
      scroll='body'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={() => {handleClose(); reset()}} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex flex-col gap-2 text-center p-6 '>
        Experiences
      </DialogTitle>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible p-6 '>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              {experienceField.map((item, index) => {

                const isCurrentJob = watch(`experiences[${index}].isCurrent`)

                const handleCheckboxChange = (index) => {

                  experienceField.forEach((_, i) => {
                    setValue(`experiences[${i}].isCurrent`, false);
                  });

                  // Check the selected checkbox
                  setValue(`experiences[${index}].isCurrent`, true);
                  setValue(`experiences[${index}].endDate`, null);
                };

                return (
                  <div
                    key={index}
                    className={classNames('repeater-item flex relative mbe-4 border rounded')}
                  >
                    <Grid container spacing={5} className='flex.5m-0 p-5 flex-1'>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller name={`experiences[${index}].jobTitle`} control={control}
                          rules={{
                            required: 'This field is required.',
                          }}
                          render={({ field }) => (
                            <CustomTextField fullWidth required={false} label={<>Job Title <span className='text-error'>*</span></>}
                              error={!!errors?.experiences?.[index]?.jobTitle} helperText={errors?.experiences?.[index]?.jobTitle?.message} {...field} />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller name={`experiences[${index}].company`} control={control}
                          rules={{
                            required: 'This field is required.',
                          }}
                          render={({ field }) => (
                            <CustomTextField fullWidth required={false} label={<>Company <span className='text-error'>*</span></>}
                              error={!!errors?.experiences?.[index]?.company} helperText={errors?.experiences?.[index]?.company?.message} {...field} />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller name={`experiences[${index}].location`} control={control}
                          rules={{
                            required: 'This field is required.',
                          }}
                          render={({ field }) => (
                            <CustomTextField fullWidth required={false} label={<>Location <span className='text-error'>*</span></>}
                              error={!!errors?.experiences?.[index]?.location} helperText={errors?.experiences?.[index]?.location?.message} {...field} />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Controller name={`experiences[${index}].startDate`} control={control}
                          rules={{
                            required: 'This field is required.',
                          }}
                          render={({ field }) => (
                            <AppReactDatepicker
                              selected={field.value} onChange={field.onChange}
                              showYearDropdown showMonthDropdown dateFormat="yyyy/MM/dd"
                              placeholderText="YYYY/MM/DD"
                              maxDate={new Date()}
                              customInput={
                                <CustomTextField
                                  {...field}
                                  label={<>Start Date {<span className='text-error'>*</span> }</>}
                                  fullWidth
                                  required
                                  error={Boolean(errors?.experiences?.[index]?.startDate)}
                                  helperText={errors?.experiences?.[index]?.startDate?.message}
                                />
                              }
                            />
                          )}
                        />
                      </Grid>
                      {!isCurrentJob && (
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <Controller
                            name={`experiences[${index}].endDate`}
                            control={control}
                            rules={{
                              required: 'This field is required.',
                            }}
                            render={({ field }) => (
                              <AppReactDatepicker
                                selected={field.value}
                                onChange={field.onChange}
                                showYearDropdown
                                showMonthDropdown
                                dateFormat="yyyy/MM/dd"
                                placeholderText="YYYY/MM/DD"
                                maxDate={new Date()}
                                customInput={
                                  <CustomTextField
                                    {...field}
                                    label={
                                      <>
                                        End Date <span className='text-error'>*</span>
                                      </>
                                    }
                                    fullWidth
                                    required
                                    error={Boolean(errors?.experiences?.[index]?.endDate)}
                                    helperText={errors?.experiences?.[index]?.endDate?.message}
                                  />
                                }
                              />
                            )}
                          />
                        </Grid>
                      )}
                      <Grid size={{ xs: 12 }}>
                        <FormControl error={Boolean(errors.checkbox)}>
                          <Controller
                            name={`experiences[${index}].isCurrent`}
                            control={control}
                            rules={{ required: false }}
                            render={({ field }) => (
                              <FormControlLabel control={<Checkbox {...field} checked={field.value} onChange={() => {handleCheckboxChange(index); field.onChange(!field.value); }} />} label='Currently working in this role' />
                            )}
                          />
                          {errors?.experiences?.[index]?.isCurrent && <FormHelperText error>This field is required.</FormHelperText>}
                        </FormControl>
                      </Grid>
                    </Grid>
                    {index !== 0 && (
                      <div className='flex flex-col justify-start border-is'>
                        <IconButton size='small' color='error' onClick={() => removeExperience(index)}>
                          <i className='tabler-x text-2xl' />
                        </IconButton>
                      </div>
                    )}
                  </div>
                )
              })}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                size='small'
                variant="tonal"
                color="primary"
                onClick={() =>
                  appendExperience({
                    jobTitle: '',
                    company: '',
                    location: '',
                    startDate: null,
                    endDate: null,
                    isCurrent: false
                  })
                }
              >
                Add More Experience
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button type='submit' variant='contained' className='mie-2 gap-2' disabled={loading}>
            {loading && <CircularProgress size={20} color='inherit' />}
            Submit
          </Button>
          <Button type='reset' variant='tonal' color='secondary' onClick={() => {reset(); handleClose() }}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )

}

export default ExperienceForm
