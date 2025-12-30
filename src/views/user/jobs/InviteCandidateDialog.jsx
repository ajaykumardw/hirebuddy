'use client';

import { useEffect, useState } from 'react';

import { useForm, Controller } from 'react-hook-form';


import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  TextField,
} from '@mui/material';

import Grid from '@mui/material/Grid2';

import { toast } from 'react-toastify';

import { useSession } from 'next-auth/react';

import DialogCloseButton from '@/components/dialogs/DialogCloseButton';

const InviteCandidateDialog = ({ open, jobId, handleClose }) => {

  const [loading, setLoading] = useState(false)

  const {data:session} = useSession();
  const token = session?.user?.token;

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
    reset,
    trigger,
    setError,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      sendWhatsApp: true,
      sendSMS: false,
      sendEmail: false,
    },
  });

  const email = watch('email');
  const mobile = watch('mobile');
  const sendSMS = watch('sendSMS');
  const sendWhatsApp = watch('sendWhatsApp');
  const sendEmail = watch('sendEmail');

  // Watch email and mobile to dynamically enable/disable checkboxes
  useEffect(() => {
    trigger(['email', 'mobile']); // re-validate when email/mobile changes
  }, [sendWhatsApp, sendSMS, sendEmail, trigger]);

  const onSubmit = async (data) => {

    if(!token) return null;

    if (!data.email && !data.mobile) return;

    setLoading(true)

    console.log({
      jobId,
      ...data,
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invite-job/${jobId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    })

    const result = await res.json();

    if (res.ok) {
      toast.success(result?.message || 'Candidate invited successfully', {
        autoClose: 10000,
        hideProgressBar: false,
      });
    } else if (res.status === 422) {
      Object.entries(result.errors).forEach(([field, messages]) => {
        setError(field, {
          type: 'custom',
          message: messages[0], // Use the first error message for each field
        });
      });

    } else {
      toast.error(result?.message || 'Failed to invite candidate', {
        autoClose: 10000,
        hideProgressBar: false,
      });
    }

    reset();

    handleClose();
    setLoading(false)
  };

  // useEffect(() => {
  //   if (open) {
  //     reset({
  //       name: '',
  //       email: '',
  //       mobile: '',
  //       sendEmail: false,
  //       sendSMS: false,
  //     }, {
  //       keepErrors: false,
  //       keepDirty: false,
  //       keepTouched: false,
  //     });
  //   }
  // }, [open, reset]);

  return (
    <Dialog
      fullWidth
      open={open}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleClose();
        }
      }}
      closeAfterTransition={false}
    >
      <DialogCloseButton onClick={handleClose}>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle>Invite Candidates</DialogTitle>
      <Divider />
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Name"
                    placeholder="John Doe"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="mobile"
                control={control}
                rules={{
                  required: sendWhatsApp || sendSMS ? 'This field is required' : false,
                  validate: (value) => {

                    if (value && !/^\d{10}$/.test(value)) return 'Mobile must be 10 digits';

                    return true;
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Mobile No."
                    required={sendWhatsApp || sendSMS}
                    placeholder="9876543210"
                    error={!!errors.mobile}
                    helperText={errors.mobile?.message}
                    slotProps={{ htmlInput: { maxLength: 10 } }}
                  />
                )}
              />
            </Grid>
            {sendEmail && (
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: sendEmail ? 'This field is required' : false,
                    validate: (value) => {

                      if (value && !/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format';
                      if (value && value.length < 5) return 'Email is too short';
                      if (value && value.length > 100) return 'Email is too long';

                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      required={sendEmail}
                      size="small"
                      label="Email ID"
                      placeholder="user@example.com"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
            )}
            <Grid size={{ xs: 12 }}>
              <FormGroup row>
                <Controller
                  name="sendWhatsApp"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      label="Send WhatsApp SMS"
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}

                        />
                      }
                    />
                  )}
                />
                <Controller
                  name="sendSMS"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      label="Send SMS"
                      disabled
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}

                        />
                      }
                    />
                  )}
                />
                <Controller
                  name="sendEmail"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      label="Send Email"
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                    />
                  )}
                />
              </FormGroup>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                variant="contained"
                type="submit"
                disabled={!sendWhatsApp && !sendSMS && !sendEmail || loading}
              >
                {loading && <CircularProgress size={20} color='inherit' />}
                Invite
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteCandidateDialog;
