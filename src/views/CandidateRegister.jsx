'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'

import { toast } from 'react-toastify'

import { Autocomplete, FormControl, FormHelperText, FormLabel, Tab } from '@mui/material'

import { Controller, useForm } from 'react-hook-form'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Styled Component Imports
import AuthIllustrationWrapper from './AuthIllustrationWrapper'


import CustomInputVertical from '@/@core/components/custom-inputs/Vertical'

import { experienceData, MenuProps, monthsOpt, yearsOpt } from '@/configs/customDataConfig'

import { formatCTC } from '@/utils/formatCTC'

const CandidateRegister = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  // const [selected, setSelected] = useState('')

  const [cities, setCities] = useState();
  const [industries, setIndustries] = useState();
  const [departments, setDepartments] = useState();

  // Hooks
  const { lang: locale } = useParams()
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  const { control, handleSubmit, watch, reset, setValue, setError, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      mobileNo: '',
      password: '',
      confirmPassword: '',
      industry: '',
      department: '',
      city: '',
      profileTitle: '',
      profileSummary: '',
      workStatus: '',
      totalExperience: '',
      years: '',
      months: '',
      currentCTC: '',
      cv: null
    }
  })

  // const handleChange = (prop) => {
  //   setSelected(prop)

  //   // console.log("work status", prop)
  // }

  const selectedYears = watch('years');
  const selectedMonths = watch('months');
  const password = watch('password');
  const workStatus = watch('workStatus');

  const onSubmit = async (data) => {

    // console.log("data:", data);

    const formData = new FormData();

    // Append regular text fields
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('mobileNo', data.mobileNo);
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);
    formData.append('industry', data.industry);
    formData.append('department', data.department);
    formData.append('city', data.city);
    formData.append('profileTitle', data.profileTitle);
    formData.append('profileSummary', data.profileSummary);
    formData.append('workStatus', data.workStatus);
    formData.append('totalExperience', data.totalExperience);
    formData.append('years', data.years);
    formData.append('months', data.months);
    formData.append('currentCTC', data.currentCTC);

    // Append file (cv)
    if (data.cv && data.cv[0]) {
      formData.append('cv', data.cv[0]);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/register`, {
      method: 'POST',
      body: formData, // No need to set headers manually for FormData
    });

    const result = await res.json();

    if(res.ok){

      toast.success('Registered Successfully', {
        autoClose: 10000,
        hideProgressBar: false,
      });

      router.push('/candidates/login');

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
      toast.error('Something went wrong', {
        autoClose: 10000,
        hideProgressBar: false,
      })
    }
  };

  return (
    <AuthIllustrationWrapper>
      <Card className='flex flex-col sm:is-[650px]'>
        <CardContent className='sm:!p-12'>
          <Link href={getLocalizedUrl('/', locale)} className='flex justify-center mbe-6'>
            <Logo />
          </Link>
          <form autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <Grid container spacing={5}>
              <Grid size={{ xs: 12 }}>
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
              <Grid size={{ xs: 12 }}>
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
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="mobileNo"
                  control={control}
                  rules={{
                    required: 'This field is required',
                    validate: {
                      validFormat: (value) => {

                        // Remove non-digit characters
                        const cleaned = value?.replace(/\D/g, '');

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
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "This field is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    },
                    validate: {
                      hasLowercase: value =>
                        /[a-z]/.test(value) || "Password must contain at least one lowercase letter",
                      hasUppercase: value =>
                        /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
                      hasNumber: value =>
                        /[0-9]/.test(value) || "Password must contain at least one number",
                      hasSymbol: value =>
                        /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Password must contain at least one symbol"
                    }
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      fullWidth
                      label={<>Password <span className='text-error'>*</span></>}
                      {...field}
                      type={isPasswordShown ? 'text' : 'password'}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                                <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      }}
                      error={!!errors.password}
                      helperText={errors?.password?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{
                    required: "This field is required",
                    validate: (value) => value === password || "Passwords must match"
                  }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label={<>Confirm Password <span className='text-error'>*</span></>}
                      type={isConfirmPasswordShown ? 'text' : 'password'}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton edge='end' onClick={handleClickShowConfirmPassword} onMouseDown={e => e.preventDefault()}>
                                <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      }}
                      error={!!errors.confirmPassword}
                      helperText={errors?.confirmPassword?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller name="city" control={control}
                  rules={{ required: 'This field is required.' }}
                  render={({ field }) => (
                    <Autocomplete
                      fullWidth
                      value={cities && cities.length > 0 && cities.find(city => city.id === field.value) || null}
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
              <Grid size={{ xs: 12 }}>
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
              <Grid size={{ xs: 12 }}>
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
              <Grid size={{ xs: 12 }}>
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
              <Grid size={{ xs: 12 }}>
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
              <Grid size={{ xs: 12 }}>
                <FormLabel className='text-[var(--mui-palette-text-primary)] text-sm'>
                  Work Status <span className='text-error'>*</span>
                </FormLabel>

                <Grid container spacing={4}>
                  <Controller
                    name="workStatus"
                    control={control}
                    rules={{
                      required: 'This field is required',
                    }}
                    render={({ field }) => {
                      const onChange = (e) => {
                        field.onChange(e);
                      };

                      return (
                        <>
                          <CustomInputVertical
                            {...field}
                            type="radio"
                            data={{
                              meta: 'Free',
                              title: 'Experienced',
                              content: 'Candidate have work experience (excluding internships)',
                              value: 'experienced',
                            }}
                            selected={field.value}
                            handleChange={onChange}
                            gridProps={{ size: { xs: 12, sm: 6 } }}
                            error={!!errors?.workStatus}
                          />

                          <CustomInputVertical
                            {...field}
                            type="radio"
                            data={{
                              meta: 'Free',
                              title: 'Fresher',
                              content: "Candidate is a student/ Haven't worked after graduation",
                              value: 'fresher',
                            }}
                            selected={field.value}
                            handleChange={onChange}
                            gridProps={{ size: { xs: 12, sm: 6 } }}
                            error={!!errors?.workStatus}
                          />
                        </>
                      );
                    }}
                  />

                  {errors?.workStatus && (
                    <FormHelperText error>
                      {errors.workStatus.message}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              {workStatus === 'experienced' &&
                <Grid container spacing={5} size={{ xs: 12 }}>
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
                            const sanitizedValue = value?.replace(/,/g, '');

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

                            const sanitizedValue = e.target.value?.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');

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
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                control={control}
                name="cv"
                rules={{
                  required: 'Resume is required',
                  validate: {
                    fileType: (value) =>
                      value && value[0]?.type === 'application/pdf' || 'Only PDF files are allowed',
                    fileSize: (value) =>
                      value && value[0]?.size <= 2 * 1024 * 1024 || 'File must be less than 2MB',
                  },
                }}
                render={({ field, fieldState }) => (
                  <CustomTextField
                    type="file"
                    label={<>Resume <span className='text-error'>*</span></>}
                    inputProps={{ accept: 'application/pdf' }}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onChange={(e) => {
                      field.onChange(e.target.files); // send FileList to form
                    }}
                  />
                )}
              />
            </Grid>
            <Button fullWidth variant='contained' type='submit'>
              Register
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>Already have an account?</Typography>
              <Typography component={Link} href={getLocalizedUrl('/candidate/login', locale)} color='primary.main'>
                Log in instead
              </Typography>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthIllustrationWrapper>
  )
}

export default CandidateRegister
