'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { signIn, useSession } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { email, object, minLength, string, pipe, nonEmpty } from 'valibot'
import classnames from 'classnames'

import { toast } from 'react-toastify'

import { CircularProgress } from '@mui/material'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// import { setCookie } from '@/utils/cookies'

// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const schema = object({
  username: pipe(string(), minLength(1, 'This field is required')),
  password: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(5, 'Password must be at least 5 characters long')
  )
})

const Login = ({ mode, isCandidate }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState(null)

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/hire-login-page-illustration.png'
  const darkIllustrationCandidate = '/images/illustrations/auth/hire-login-page-illustration.png'
  const lightIllustration = '/images/illustrations/auth/hire-login-page-illustration.png'
  const lightIllustrationCandidate = '/images/illustrations/auth/hire-login-page-illustration.png'

  // const borderedDarkIllustration = '/images/illustrations/auth/v2-login-dark-border.png'
  // const borderedLightIllustration = '/images/illustrations/auth/v2-login-light-border.png'

  const borderedDarkIllustration = '/images/illustrations/auth/hire-login-page-illustration.png'
  const borderedLightIllustration = '/images/illustrations/auth/hire-login-page-illustration.png'

  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang: locale } = useParams()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const [loading, setLoading] = useState(false)
  const jobApply = searchParams.get('apply_job') || null;

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(schema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const characterIllustration = useImageVariant(
    mode,
    isCandidate ? lightIllustrationCandidate : lightIllustration,
    isCandidate ? darkIllustrationCandidate : darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  // Helper function to set a cookie
  // const setCookie = (name, value, days) => {
  //   const date = new Date();
  //   date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Expiry time
  //   const expires = "expires=" + date.toUTCString();
  //   // Set the cookie (secure and SameSite=Strict for production)
  //   document.cookie = `${name}=${value}; ${expires}; path=/; httpOnly; secure; SameSite=Strict`;
  // };

  const onSubmit = async data => {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username: data.username, password: data.password }),
    // });

    setLoading(true);

    try {

      const res = await signIn('credentials', {
        email: data.username,
        password: data.password,
        isCandidate: Boolean(isCandidate),
        jobApply: jobApply,
        redirect: false
      })

      if (res && res.ok && res.error === null) {

        if(jobApply){

          const redirectURL = '/candidate/jobs/applied-success'

          router.replace(getLocalizedUrl(redirectURL, locale))

        } else{

          // Vars
          const redirectURL = searchParams.get('redirectTo') ?? '/dashboard'

          router.replace(getLocalizedUrl(redirectURL, locale))
        }

      } else {
        if (res?.error) {
          const error = JSON.parse(res.error)

          setErrorState(error)
        }
      }

    } catch (error) {
      toast.error("Something went wrong. Server is not working", {
        autoClose: 10000,
        hideProgressBar: false,
      });

      console.log("error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <LoginIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
            <Typography>Please sign-in to your account and start the adventure</Typography>
          </div>
          {/* <Alert icon={false} className='bg-[var(--mui-palette-primary-lightOpacity)]'>
            <Typography variant='body2' color='primary.main'>
              Email: <span className='font-medium'>admin@vuexy.com</span> / Pass:{' '}
              <span className='font-medium'>admin</span>
            </Typography>
          </Alert> */}
          <form
            noValidate
            autoComplete='off'
            action={() => {}}
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <Controller
              name='username'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  fullWidth
                  type='text'
                  label={isCandidate ? 'Email ID/ Mobile No.' : 'Login ID'}
                  placeholder={isCandidate ? 'Enter your Email ID/ Mobile No.' : 'Enter your Login ID'}
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  {...((errors.username || errorState !== null) && {
                    error: true,
                    helperText: errors?.username?.message || errorState?.message
                  })}
                />
              )}
            />
            <Controller
              name='password'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Password'
                  placeholder='············'
                  id='login-password'
                  type={isPasswordShown ? 'text' : 'password'}
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
                  {...(errors.password && { error: true, helperText: errors.password.message })}
                />
              )}
            />
            {/* <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <FormControlLabel control={<Checkbox defaultChecked />} label='Remember me' />
              <Typography
                className='text-end'
                color='primary.main'
                component={Link}
                href={getLocalizedUrl('/forgot-password', locale)}
              >
                Forgot password?
              </Typography>
            </div> */}
            <Button fullWidth variant='contained' type='submit' className='gap-2' disabled={loading}>
              {loading && <CircularProgress size={20} color='inherit' />}
              { jobApply ? 'Login & Apply' : 'Login' }
            </Button>
            {!isCandidate &&
            <Button fullWidth variant='outlined' className='gap-2' onClick={() => router.replace(getLocalizedUrl('candidate/login', locale))}>
              Candidate Login
            </Button>}
            {jobApply &&
              <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>New on our platform?</Typography>
                <Typography component={Link} href={`/jobs/${jobApply}`} color='primary.main'>
                  Register & Apply
                </Typography>
              </div>
            }
            {/* <Divider className='gap-2'>or</Divider>
            <Button
              color='secondary'
              className='self-center text-textPrimary'
              startIcon={<img src='/images/logos/google.png' alt='Google' width={22} />}
              sx={{ '& .MuiButton-startIcon': { marginInlineEnd: 3 } }}
              onClick={() => signIn('google')}
            >
              Sign in with Google
            </Button> */}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
