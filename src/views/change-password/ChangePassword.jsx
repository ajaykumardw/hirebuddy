'use client'

// React Imports
import { useState } from 'react'

import { useSession } from 'next-auth/react';

import { toast } from 'react-toastify';

import { useForm, Controller } from 'react-hook-form';

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

//Component Imports
import CustomTextField from '@core/components/mui/TextField'

const ChangePassword = () => {
  // States
  const [isCurrentPasswordShown, setIsCurrentPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [isNewPasswordShown, setIsNewPasswordShown] = useState(false)

  const { data: session } = useSession();
  const token = session?.user?.token;

  const { control, watch, handleSubmit, setError, formState: { errors }, reset } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // Watch the new password field value
  const newPasswordValue = watch('newPassword');

  // Handle form submission
  const onSubmit = async (data) => {

    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {

        // Success: Show a success toast
        toast.success('Password changed successfully!', {
          autoClose: 10000,
          hideProgressBar: false,
        });

        reset()

      } else if(res.status == 422) {

        // Laravel returns validation errors in the `errors` object
        Object.entries(result.errors).forEach(([field, messages]) => {
          setError(field, {
            type: 'custom',
            message: messages[0], // Use the first error message for each field
          });
        });

      } else {

        // Failure: Show an error toast with the message from the API
        toast.error(result.message || 'Something went wrong. Please try again.', {
          autoClose: 10000,
          hideProgressBar: false,
        });

      }
    } catch (error) {

      // Error: Show a toast for network or unexpected error
      toast.error('Network error or something went wrong. Please try again later.', {
        autoClose: 10000,
        hideProgressBar: false,
      });

    }

  };

  return (
    <Card>
      <CardHeader title='Change Password' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="currentPassword"
                control={control}
                rules={{
                  required: "Current Password is required"
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Current Password"
                    type={isCurrentPasswordShown ? 'text' : 'password'}
                    placeholder="············"
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={() => setIsCurrentPasswordShown(!isCurrentPasswordShown)}
                              onMouseDown={(e) => e.preventDefault()}
                            >
                              <i className={isCurrentPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container className="mt-4" spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="newPassword"
                control={control}
                rules={{
                  required: "New Password is required",
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
                    {...field}
                    fullWidth
                    label="New Password"
                    type={isNewPasswordShown ? 'text' : 'password'}
                    placeholder="············"
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={() => setIsNewPasswordShown(!isNewPasswordShown)}
                              onMouseDown={(e) => e.preventDefault()}
                            >
                              <i className={isNewPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Confirm New Password is required",
                  validate: (value) => value === newPasswordValue || "Passwords must match"
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Confirm New Password"
                    type={isConfirmPasswordShown ? 'text' : 'password'}
                    placeholder="············"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                              onMouseDown={(e) => e.preventDefault()}
                            >
                              <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }} className="flex flex-col gap-4">
              <Typography variant="h6">Password Requirements:</Typography>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2.5">
                  <i className="tabler-circle-filled text-[8px]" />
                  Minimum 8 characters long - the more, the better
                </div>
                <div className="flex items-center gap-2.5">
                  <i className="tabler-circle-filled text-[8px]" />
                  At least one lowercase & one uppercase character
                </div>
                <div className="flex items-center gap-2.5">
                  <i className="tabler-circle-filled text-[8px]" />
                  At least one number or symbol
                </div>
              </div>
            </Grid>

            <Grid size={{ xs: 12 }} className="flex gap-4">
              <Button variant="contained" type="submit">Update Password</Button>
              <Button variant="tonal" type="reset" color="secondary" onClick={() => reset()}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ChangePassword
