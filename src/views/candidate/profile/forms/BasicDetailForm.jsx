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

import { Autocomplete, Checkbox, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, Tab, Typography } from '@mui/material'

// Components Imports
import classNames from 'classnames'


import { useSession } from 'next-auth/react'

import { format, isValid, parse } from 'date-fns'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'

// Styled Component Imports

import { monthsOpt, yearsOpt } from '@/configs/customDataConfig'

import { formatCTC } from '@/utils/formatCTC'

import CustomInputVertical from '@/@core/components/custom-inputs/Vertical'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

const BasicDetailForm = ({ setData, open, data, industries, departments, handleClose, isCandidate}) => {

  // console.log('industry:', data)

  // const [selected, setSelected] = useState(data?.work_status || '')
  const [loadingCities, setLoadingCities] = useState(false);
  const [cities, setCities] = useState([]);
  const [roleCategories, setRoleCategories] = useState([]);
  const [loadingRoleCategories, setLoadingRoleCategories] = useState(false);
  const [jobRoles, setJobRoles] = useState([]);
  const [loadingJobRoles, setLoadingJobRoles] = useState(false);
  const [candidate_id, setCandidateId] = useState(data?.id || null);

  const { data: session } = useSession()
  const token = session?.user?.token
  const router = useRouter();

  useEffect(() => {
    const fetchCities = async () => {
      if(!token) return
      setLoadingCities(true);

      try {

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all-locations`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          method: 'get',
        });

        if(res.ok){
          const data = await res.json();

          setCities(data?.all_locations || []);
        } else {
          setCities([]);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }


    }

    console.log('fetching cities')

    fetchCities()
  }, [token])

  // function getAllMonths(start, end) {
  //   const months = [];
  //   const formats = ['dd-MM-yyyy', 'MM-yyyy', 'yyyy-MM-dd', 'yyyy-MM'];

  //   const parsedStartDate = formats.reduce((acc, format) => {
  //     const parsed = parse(start, format, new Date());

  //     return isNaN(parsed) ? acc : parsed;
  //   }, new Date());

  //   const parsedEndDate = end && end != 'current_time' ? formats.reduce((acc, format) => {
  //     const parsed = parse(end, format, new Date());

  //     return isNaN(parsed) ? acc : parsed;
  //   }, new Date()) : new Date();

  //   const date = new Date(parsedStartDate);

  //   while (date <= parsedEndDate) {
  //     months.push(format(date, 'yyyy-MM'));
  //     date.setMonth(date.getMonth() + 1);
  //   }

  //   return months;
  // }

  function getAllMonths(start, end) {
    const months = [];
    const formats = ['dd-MM-yyyy', 'MM-yyyy', 'yyyy-MM-dd', 'yyyy-MM'];

    // ✅ Early exit if start is missing
    if (!start) {

      // console.error('Start date is required');

      return months;
    }

    // ✅ Parse start date
    const parsedStartDate = formats.reduce((acc, format) => {
      const parsed = parse(start, format, new Date());

      return isValid(parsed) ? parsed : acc;
    }, null);

    if (!parsedStartDate) {

      // console.error('Invalid start date:', start);

      return months;
    }

    // ✅ Parse end date or use current date
    const parsedEndDate =
      end && end !== 'current_time'
        ? formats.reduce((acc, format) => {
            const parsed = parse(end, format, new Date());

            return isValid(parsed) ? parsed : acc;
          }, null)
        : new Date();

    if (!parsedEndDate) {

      // console.error('Invalid end date:', end);

      return months;
    }

    const date = new Date(parsedStartDate);

    while (date <= parsedEndDate) {
      months.push(format(date, 'yyyy-MM'));
      date.setMonth(date.getMonth() + 1);
    }

    return months;
  }

  // const handleChange = (prop) => {
  //   setSelected(prop)
  // }

  const monthSet = new Set();

  data?.experiences?.forEach(job => {
    getAllMonths(job.start_date, job.end_date).forEach(m => monthSet.add(m));
  });

  data?.experience?.forEach(job => {
    getAllMonths(job.start_date, job.end_date).forEach(m => monthSet.add(m));
  });

  const totalMonths = monthSet.size;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  // console.log('years and month', years, months);

  const { control, handleSubmit, watch, reset, resetField, setValue, setError, formState: { errors } } = useForm({

    values: {
      fullName: data?.full_name || '',
      email: data?.email || '',
      mobileNo: data?.mobile_no || '',
      industry: data?.industry_id || '',
      department: data?.department_id || '',
      roleCategory: data?.role_category_id || '',
      jobRole: data?.job_role_id || '',
      city: data?.city_id || '',
      profileTitle: data?.profile_title || '',
      profileSummary: data?.profile_summary || '',
      workStatus: data?.work_status || '',
      dateOfBirth: data?.date_of_birth ? new Date(data?.date_of_birth) : null,
      totalExperience: data?.total_experience || '',
      years: data?.total_experience ? data?.total_experience?.split('.')[0] : years.toString() ||'',
      months: data?.total_experience ? data?.total_experience?.split('.')[1] : months.toString() ||'',
      currentCTC: data?.current_ctc || '',

      createAccount: data?.is_account === '1' ? true : false
    }
  });

  // console.log("errors:", errors);

  const onSubmit = async (data) => {

    // console.log("data:", data);

    // Filter out completely blank experiences
    const filteredExperiences = data.experiences?.filter(exp =>
      exp.jobTitle || exp.company || exp.location || exp.startDate
    ) || [];

    const payload = {
      ...data,
      experiences: filteredExperiences
    };

    if(token){

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/profile`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({...data, candidate_id: candidate_id, }),
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
  };

  const selectedYears = watch('years');
  const selectedMonths = watch('months');
  const workStatus = watch('workStatus');
  const selectedDepartment = watch("department");
  const selectedRoleCategory = watch("roleCategory");

  const fetchRoleCategories = async () => {
    if(!selectedDepartment) return

    setLoadingRoleCategories(true);

    resetField('roleCategory');
    resetField('jobRole');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/departments/${selectedDepartment}/role-categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await res.json();

      if(res.ok){
        setRoleCategories(result?.role_categories || []);
      } else {
        setRoleCategories([]);
      }

    } catch (error) {
      console.error('Error fetching role categories:', error);
      setRoleCategories([]);
    } finally {
      setLoadingRoleCategories(false);
    }

  }

  const fetchJobRoles = async () => {
    if(!selectedRoleCategory) return

    setLoadingJobRoles(true);

    resetField('jobRole');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/role-categories/${selectedRoleCategory}/job-roles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await res.json();

      if(res.ok){
        setJobRoles(result?.job_roles || []);
      } else {
        setJobRoles([]);
      }

    } catch (error) {
      console.error('Error fetching job roles:', error);
      setJobRoles([]);
    } finally {
      setLoadingJobRoles(false);
    }

  }

  useEffect(() => {
    if (selectedDepartment) {
      fetchRoleCategories();
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedRoleCategory) {
      fetchJobRoles();
    }
  }, [selectedRoleCategory]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='xl'
      scroll='body'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex flex-col gap-2 text-center p-6 '>
        Basic details
        {/* <Typography component='span' className='flex flex-col text-center'>
          {data ? 'Edit your saved card details' : 'Add card for future billing'}
        </Typography> */}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 p-6 '>

          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="fullName" control={control}
                rules={{
                  required: 'This field is required.',

                }}
                render={({ field }) => (
                  <CustomTextField fullWidth label={<>Full Name <span className='text-error'>*</span></>}
                    required={false}
                    error={!!errors?.fullName} helperText={errors?.fullName?.message} {...field} />
                )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="email" control={control}
                rules={{
                  required: 'This field is required.',
                  pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Invalid email' }
                }}
                render={({ field }) => (
                  <CustomTextField fullWidth required={false} label={<>Email <span className='text-error'>*</span></>} type="email"
                    error={!!errors.email} helperText={errors.email?.message} {...field} />
                )} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="mobileNo"
                control={control}
                rules={{
                  required: 'This field is required',
                  validate: {
                    validFormat: (value) => {

                      // Remove non-digit characters
                      const cleaned = value.replace(/\D/g, '');

                      // If it starts with '91' and has 12 digits, remove the '91'
                      let normalized = cleaned;

                      if (cleaned.length === 12 && cleaned.startsWith('91')) {
                        normalized = cleaned.slice(2);
                      } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
                        normalized = cleaned.slice(1);
                      }

                      if (!/^[6-9]\d{9}$/.test(normalized)) {
                        return 'Please enter a valid 10-digit mobile number';
                      }

                      return true;
                    },
                  }
                }}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    required={false}
                    label={<>Mobile No. <span className='text-error'>*</span></>}
                    error={!!errors.mobileNo}
                    helperText={errors.mobileNo?.message}
                    {...field}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9+]/g, '');
                    }}
                    inputProps={{
                      maxLength: 13,
                      inputMode: 'tel',
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="city" control={control}
                rules={{ required: 'This field is required.' }}
                render={({ field }) => (
                  <Autocomplete
                    fullWidth
                    value={cities && cities?.length > 0 && cities.find(city => city.id === field.value) || null}
                    options={cities || []}
                    getOptionKey={option => option.id}
                    getOptionLabel={(city) => city.city_name || ''}
                    onChange={(event, value) => {
                        field.onChange(value?.id || '')
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        label={<>Current City <span className='text-error'>*</span></>}
                        error={!!errors.city}
                        helperText={errors?.city?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="industry" control={control}
                rules={{ required: 'This field is required.' }}
                render={({ field }) => (
                  <Autocomplete
                    fullWidth
                    value={industries && industries.length > 0 && industries.find(industry => industry.id === field.value) || null}
                    options={industries || []}
                    groupBy={option => option.category || ''}
                    getOptionKey={option => option.id}
                    getOptionLabel={(industry) => industry.name || ''}
                    onChange={(event, value) => {
                      field.onChange(value?.id || '');
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        label={<>Industry <span className='text-error'>*</span></>}
                        error={!!errors.industry}
                        helperText={errors?.industry?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="department" control={control}
                rules={{ required: 'This field is required.' }}
                render={({ field }) => (
                  <Autocomplete
                    fullWidth
                    value={departments && departments.length > 0 && departments.find(department => department.id === field.value) || null}
                    options={departments || []}
                    getOptionKey={option => option.id}
                    getOptionLabel={(department) => department.name || ''}
                    onChange={(event, value) => {
                        field.onChange(value?.id || '')
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        label={<>Department <span className='text-error'>*</span></>}
                        error={!!errors.department}
                        helperText={errors?.department?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            {selectedDepartment &&
              <Grid size={{ xs: 12, sm: selectedRoleCategory ? 6 : 12 }}>
                <Controller
                  name='roleCategory'
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      fullWidth
                      loading={loadingRoleCategories}
                      value={roleCategories && roleCategories.length > 0 && roleCategories.find(roleCategory => roleCategory.id === field.value) || null}
                      options={roleCategories || []}
                      getOptionKey={option => option.id}
                      getOptionLabel={(roleCategory) => roleCategory.name || ''}
                      onChange={(event, value) => {
                        field.onChange(value?.id || '')
                      }}
                      renderInput={(params) => (
                        <CustomTextField
                          {...params}
                          label='Role Category'
                          placeholder='Select Role Category'
                          error={!!errors?.roleCategory}
                          helperText={errors?.roleCategory?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              } {selectedRoleCategory &&
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='jobRole'
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      fullWidth
                      loading={loadingJobRoles}
                      value={jobRoles && jobRoles.length > 0 && jobRoles.find(jobRole => jobRole.id === field.value) || null}
                      options={jobRoles || []}
                      getOptionKey={option => option.id}
                      getOptionLabel={(jobRole) => jobRole.name || ''}
                      onChange={(event, value) => {
                        field.onChange(value?.id || '')
                      }}
                      renderInput={(params) => (
                        <CustomTextField
                          {...params}
                          label='Job Role'
                          placeholder='Select Job Role'
                          error={!!errors?.jobRole}
                          helperText={errors?.jobRole?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              }
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="profileTitle"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Profile Title'
                    placeholder='PHP | MERN | Full Stack or Student'
                    error={!!errors?.profileTitle}
                    helperText={errors?.profileTitle?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="profileSummary"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    multiline
                    maxRows={4}
                    label='Profile Summary'
                    error={!!errors?.profileSummary}
                    helperText={errors?.profileSummary?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormLabel className='text-[var(--mui-palette-text-primary)] text-sm'>Work Status <span className='text-error'>*</span></FormLabel>
              <Grid container spacing={4}>
                <Controller
                  name="workStatus"
                  control={control}
                  rules={{
                    required: 'This field is required',
                  }}
                  render={({ field }) => (
                    <>
                    <CustomInputVertical
                    {...field}
                      type='radio'
                      data={{
                        meta: 'Free',
                        title: 'Experienced',
                        content: "Candidate have work experience (excluding internships)",
                        value: 'experienced'
                      }}
                      error={true}
                      selected={field.value}
                      handleChange={(e) => {field.onChange(e)}}
                      gridProps={{ size: { xs: 12, sm: 6 } }}
                    /></>
                  )}
                />
                <Controller
                  name="workStatus"
                  control={control}
                  rules={{
                    required: 'This field is required',
                  }}
                  render={({ field }) => (
                    <CustomInputVertical
                      type='radio'
                      data={{
                        meta: 'Free',
                        title: 'Fresher',
                        content: "Candidate is a student/ Haven't worked after graduation",
                        value: 'fresher'
                      }}
                      selected={field.value}
                      handleChange={(e) => {field.onChange(e)}}
                      gridProps={{ size: { xs: 12, sm: 6 } }}
                    />
                  )}
                />

                {errors?.workStatus && <FormHelperText error>{errors?.workStatus?.message}</FormHelperText>}
              </Grid>
            </Grid>
            {workStatus === 'experienced' &&
              <Grid container spacing={5} size={{ xs: 12, sm: 6 }}>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth error={Boolean(errors?.years || errors?.months)}>
                    <FormLabel className='text-[var(--mui-palette-text-primary)] text-sm'>
                      Total Experience <span className="text-error">*</span>
                    </FormLabel>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: selectedYears !== '31' ? 6 : 12 }}>
                        <Controller
                          name="years"
                          control={control}
                          rules={{
                            required: 'This field is required',
                          }}
                          render={({ field }) => (
                            <Autocomplete
                              fullWidth
                              {...field}
                              options={yearsOpt ? (selectedMonths === '0' || selectedMonths === ''  ? yearsOpt?.filter(option => option.value !== '0') : yearsOpt) : []}
                              value={
                                selectedMonths === '0' && field.value === '0'
                                  ? null
                                  : yearsOpt.find(option => option.value === field.value) || null
                              }
                              getOptionKey={option => option.value}
                              getOptionLabel={(option) => option.label || ''}
                              onChange={(event, value) => {
                                field.onChange(value?.value || '')
                              }}
                              renderInput={(params) => (
                                <CustomTextField
                                  {...params}
                                  error={!!errors?.years}
                                  helperText={errors?.years?.message}
                                  placeholder='Years'
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      {selectedYears !== '31' &&
                        <Grid size={{ xs: 6 }}>
                          <Controller
                            name="months"
                            control={control}
                            rules={{
                              required: 'This field is required',
                            }}
                            render={({ field }) => (
                              <Autocomplete
                                fullWidth
                                {...field}
                                getOptionKey={option => option.value}
                                getOptionLabel={(option) => option.label || ''}
                                options={selectedYears === '0' ? monthsOpt.filter(option => option.value !== '0') : monthsOpt}
                                value={
                                  selectedYears === '0' && field.value === '0'
                                    ? null
                                    : monthsOpt.find(option => option.value === field.value) || null
                                }
                                onChange={(event, value) => {
                                  field.onChange(value?.value || '')
                                }}
                                renderInput={(params) => (
                                  <CustomTextField
                                    {...params}
                                    error={!!errors?.months}
                                    helperText={errors?.months?.message}
                                    placeholder='Months'
                                  />
                                )}
                              />
                            )}
                          />
                        </Grid>
                      }
                    </Grid>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="currentCTC"
                    control={control}
                    rules={{
                      required: 'This field is required',
                      validate: {
                        isValidCTC: (value) => {

                          // Remove commas from the value for proper numeric validation
                          const sanitizedValue = value.replace(/,/g, '');

                          // Validate the sanitized value to ensure it's a numeric value with an optional decimal part (up to 2 digits)
                          if (!/^\d+(\.\d{1,2})?$/.test(sanitizedValue)) {

                            return 'Please enter a valid CTC (numeric value, optionally with 2 decimal places)';
                          }

                          return true;
                        },
                      },
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        label={
                          <>
                            Current CTC <span className="text-error">*</span>
                          </>
                        }
                        error={!!errors.currentCTC}
                        helperText={errors.currentCTC?.message}
                        {...field}
                        placeholder="Eg. 4,24,000"
                        value={formatCTC(field.value)}
                        onInput={(e) => {

                          const sanitizedValue = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');

                          field.onChange(sanitizedValue);
                        }}
                        inputProps={{
                          maxLength: 12,  // Optional: restrict the length of the number
                          pattern: '[0-9.,]*',  // Allow numbers and one dot for decimal
                          inputMode: 'decimal',  // Enable numeric keypad with decimal on mobile
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            }
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="dateOfBirth" control={control}
                render={({ field }) => (
                  <AppReactDatepicker
                    selected={field.value} onChange={field.onChange}
                    showYearDropdown showMonthDropdown dateFormat="yyyy/MM/dd"
                    placeholderText="YYYY/MM/DD"
                    customInput={
                      <CustomTextField fullWidth label='Date of Birth'
                        error={!!errors.dateOfBirth} helperText={errors?.dateOfBirth?.message} />
                    }
                  />
                )} />
            </Grid>
          </Grid>

        </DialogContent>
        <CardActions>
          <Button type='submit' variant='contained' className='mie-2'>
            Submit
          </Button>
          <Button type='reset' variant='tonal' color='secondary' onClick={() => {reset();}}>
            Reset
          </Button>
        </CardActions>
      </form>
    </Dialog>
  )
}

export default BasicDetailForm
