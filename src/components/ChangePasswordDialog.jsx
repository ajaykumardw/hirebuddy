import { useState } from "react"

import Dialog from '@mui/material/Dialog'
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid2'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material"

import { Controller, useForm } from "react-hook-form"

import { useSession } from "next-auth/react"

import { toast } from "react-toastify"

import DialogCloseButton from "./dialogs/DialogCloseButton"

const ChangePasswordDialog = ({ open, onClose, userId }) => {
  // States
  const [loading, setLoading] = useState(false)
  const [isNewPasswordShown, setIsNewPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  const { data: session } = useSession();
  const token = session?.user?.token;

  const { control, watch, handleSubmit, setError, formState: { errors }, reset } = useForm({
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPasswordValue = watch('newPassword');

  const onSubmit = async (data) => {
    // if (password !== confirmPassword) {
    //   setError('Passwords do not match')
    //   return
    // }

    if (!token) return;

    console.log("Updating password for user ID:", userId)

    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/users/${userId}/change-password`, {
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

        handleClose()

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

    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleClose}>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle>Change Password</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="newPassword"
                control={control}
                rules={{
                  required: 'This field is required.'
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="New Password"
                    type={isNewPasswordShown ? 'text' : 'password'}
                    fullWidth
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
            <Grid size={{ xs: 12 }}>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: 'This field is required.',
                  validate: (value) => value === newPasswordValue || "Passwords must match"
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm Password"
                    type={isConfirmPasswordShown ? 'text' : 'password'}
                    fullWidth
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
          </Grid>
        </DialogContent>
        <DialogActions className="flex flex-wrap gap-4">
          <Button onClick={handleClose} variant="tonal" disabled={loading}>Cancel</Button>
          <Button type="submit" color="primary" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ChangePasswordDialog
