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

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

import { qualificationData } from '@/configs/customDataConfig'

const EducationForm = ({ setData, open, data, handleClose }) => {

  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const token = session?.user?.token

  function parseDateFromString(dateStr) {
    if (!dateStr) return null;

    const parts = dateStr.split("-");

    // Case 1: "MM-YYYY"
    if (parts.length === 2) {
      const [month, year] = parts;

      return new Date(`${year}-${month}-01`);
    }

    // Case 2: "DD-MM-YYYY"
    if (parts.length === 3) {
      const [day, month, year] = parts;

      return new Date(`${year}-${month}-${day}`);
    }

    // Fallback
    return new Date(dateStr);
  }

  const { control, handleSubmit, watch, reset, setValue, setError, formState: { errors } } = useForm({

    values: {
      educations: data?.length > 0
        ? data.map((edu) => ({
          id: edu?.id || null,
          educationLevel: edu?.education_level || '',
          branchOrBoard: edu?.branch_or_board || '',
          degree: edu?.degree || '',
          schoolOrInstitute: edu?.school_or_institute || '',
          gradeType: edu?.grade_type || '',
          gradeValue: edu?.grade_value || '',
          passingYear: edu?.passing_year ? edu?.passing_year : null || null,
        }))
        : [
          {
            educationLevel: '',
            branchOrBoard: '',
            degree: '',
            schoolOrInstitute: '',
            gradeType: '',
            gradeValue: '',
            passingYear: null,
          }
        ],
    }
  });

  const { fields: educationField, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'educations',
  });

  const onSubmit = async (data) => {

    // console.log("data:", data);
    setLoading(true);

    // Filter out completely blank experiences
    const filteredExperiences = data.experiences?.filter(exp =>
      exp.jobTitle || exp.company || exp.location || exp.startDate
    ) || [];

    const payload = {
      ...data,
      experiences: filteredExperiences
    };

    if (token) {

      try {

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/profile/education`, {
          method: 'put',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (res.ok) {


          setData(result.data);

          toast.success(result.message, {
            autoClose: 10000,
            hideProgressBar: false,
          });

          // fetchData();

          handleClose();

          reset();


        } else if (res.status == 422) {

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

      } catch (error) {
        console.log("error", error);
        toast.error("Something went wrong.", {
          autoClose: 10000,
          hideProgressBar: false,
        });
        setLoading(false);
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
      <DialogCloseButton onClick={() => { handleClose(); reset() }} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex flex-col gap-2 text-center p-6 '>
        Educations
      </DialogTitle>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible p-6 '>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              {educationField.map((item, index) => {

                return (
                  <div
                    key={index}
                    className={classNames('repeater-item flex relative mbe-4 border rounded')}
                  >
                    <Grid container spacing={5} className='flex.5m-0 p-5 flex-1'>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller name={`educations[${index}].educationLevel`} control={control}
                          rules={{
                            required: 'This field is required.',
                          }}
                          render={({ field }) => (
                            <CustomTextField
                              fullWidth
                              select
                              required={false}
                              label={<>Education Level <span className='text-error'>*</span></>}
                              error={!!errors?.educations?.[index]?.educationLevel}
                              helperText={errors?.educations?.[index]?.educationLevel?.message}
                              {...field}
                            >
                              {qualificationData.map((qual) => (
                                <MenuItem key={qual.value} value={qual.value}>{qual.label}</MenuItem>
                              ))}
                              {/* <MenuItem value='10th'>10th</MenuItem>
                              <MenuItem value='12th'>12th</MenuItem>
                              <MenuItem value='Diploma'>Diploma</MenuItem>
                              <MenuItem value='Graduate'>Graduate</MenuItem>
                              <MenuItem value='UG'>UG</MenuItem>
                              <MenuItem value='PG'>PG</MenuItem>
                              <MenuItem value='PHD'>PHD</MenuItem> */}
                            </CustomTextField>
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller name={`educations[${index}].degree`} control={control}

                          render={({ field }) => (
                            <CustomTextField fullWidth required={false} label='Degree'
                              error={!!errors?.educations?.[index]?.degree} helperText={errors?.educations?.[index]?.degree?.message} {...field} />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller name={`educations[${index}].branchOrBoard`} control={control}
                          render={({ field }) => (
                            <CustomTextField fullWidth required={false} label={<>Branch or Board</>}
                              error={!!errors?.educations?.[index]?.company} helperText={errors?.educations?.[index]?.branchOrBoard?.message} {...field} />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller name={`educations[${index}].schoolOrInstitute`} control={control}
                          render={({ field }) => (
                            <CustomTextField fullWidth required={false} label={<>School or Institute</>}
                              error={!!errors?.educations?.[index]?.schoolOrInstitute} helperText={errors?.educations?.[index]?.schoolOrInstitute?.message} {...field} />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller name={`educations[${index}].gradeType`} control={control}
                          render={({ field }) => (
                            <CustomTextField fullWidth required={false} label='Grade Type'
                              error={!!errors?.educations?.[index]?.gradeType} helperText={errors?.educations?.[index]?.gradeType?.message} {...field} />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller name={`educations[${index}].gradeValue`} control={control}
                          render={({ field }) => (
                            <CustomTextField fullWidth required={false} label='Grade Value'
                              error={!!errors?.educations?.[index]?.gradeValue} helperText={errors?.educations?.[index]?.gradeValue?.message} {...field} />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Controller name={`educations[${index}].passingYear`} control={control}
                          render={({ field }) => (
                            <AppReactDatepicker
                              selected={field.value} onChange={field.onChange}
                              showYearDropdown showMonthDropdown dateFormat="yyyy/MM/dd"
                              placeholderText="YYYY/MM/DD"
                              maxDate={new Date()}
                              customInput={
                                <CustomTextField
                                  {...field}
                                  label='Passing Year'
                                  fullWidth
                                  required
                                  error={Boolean(errors?.educations?.[index]?.passingYear)}
                                  helperText={errors?.educations?.[index]?.passingYear?.message}
                                />
                              }
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                    {index !== 0 && (
                      <div className='flex flex-col justify-start border-is'>
                        <IconButton size='small' color='error' onClick={() => removeEducation(index)}>
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
                  appendEducation({
                    educationLevel: '',
                    degree: '',
                    branchOrBoard: '',
                    schoolOrInstitute: '',
                    gradeType: '',
                    gradeValue: '',
                    passingYear: null
                  })
                }
              >
                Add More Education
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
          <Button type='reset' variant='tonal' color='secondary' onClick={() => { reset(); handleClose() }}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )

}

export default EducationForm
