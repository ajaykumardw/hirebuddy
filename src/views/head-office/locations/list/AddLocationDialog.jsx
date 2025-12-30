'use client'

import { useState } from 'react';

import { toast } from 'react-toastify';

import { useSession } from 'next-auth/react'

import { Controller, useFieldArray, useForm } from 'react-hook-form';

import Grid from '@mui/material/Grid2'

import classNames from 'classnames';

import { Autocomplete, Button, Checkbox, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, IconButton, MenuItem, Tab, TablePagination, Typography } from "@mui/material";

import Alert from '@mui/material/Alert'

import AlertTitle from '@mui/material/AlertTitle'

import DialogCloseButton from "@/components/dialogs/DialogCloseButton";

import CustomTextField from '@/@core/components/mui/TextField';

const AddLocationDialog = ({open, handleClose, stateData, locationData, setData}) => {

  const { data: session } = useSession()
  const token = session?.user?.token;

  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset, setValue, watch, setError, formState: { errors } } = useForm({
    values: {
      state: '',
      locations: [{
        name: ''
      }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'locations',
  });

  const onSubmit = async (data) => {

    console.log("submitted data:", data)

    setLoading(true);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cities/bulk-add`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if(res.ok){

      console.log("success: ", result);

      setData(result?.locations)

      toast.success(result.message, {
        autoClose: 10000,
        hideProgressBar: false
      });
      reset();
      handleClose();

    } else if(res.status == 422) {

      // Laravel returns validation errors in the `errors` object
      Object.entries(result.errors).forEach(([field, messages]) => {
        setError(field, {
          type: 'custom',
          message: messages[0], // Use the first error message for each field
        });
      });

    } else {

      toast.error(result.message, {
        autoClose: 10000,
        hideProgressBar: false,
      });
      reset();
      handleClose();

    }

    setLoading(false);
  }


  return (
      <Dialog
        fullWidth
        open={open}
        maxWidth='sm'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={() => {handleClose();}}>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle>
          Add Locations
        </DialogTitle>
        <Divider />
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12 }}>
                <Alert severity="warning" icon={false}>
                  <AlertTitle>Warning</AlertTitle>
                  Locations must be approved before they can be used.
                </Alert>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller name="state" control={control}
                  rules={{ required: 'This field is required.' }}
                  render={({ field }) => (
                    <Autocomplete
                      fullWidth
                      value={stateData && stateData.length > 0 && stateData.find(state => state.id === field.value) || null}
                      options={stateData || []}
                      getOptionKey={option => option.id}
                      getOptionLabel={(state) => state.state_name || ''}
                      onChange={(event, value) => {
                        field.onChange(value?.id || '')
                      }}
                      renderInput={(params) => (
                        <CustomTextField
                          {...params}
                          label={<>State <span className='text-error'>*</span></>}
                          error={!!errors.state}
                          helperText={errors?.state?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                {fields.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={classNames('repeater-item flex relative mbe-4 border rounded')}
                    >
                      <Grid size={{ xs:12 }} key={index} className='flex.5m-0 p-5 flex-1'>
                        <Controller
                          control={control}
                          name={`locations.${index}.name`}
                          rules={{ required: 'This field is required' }}
                          render={({ field }) => (
                            <CustomTextField
                              {...field}
                              fullWidth
                              label={<>Location <span className='text-error'>*</span></>}
                              error={!!errors.locations?.[index]?.name}
                              helperText={errors.locations?.[index]?.name?.message}
                            />
                          )}
                        />
                      </Grid>
                      {index !== 0 && (
                        <div className='flex flex-col justify-start border-is'>
                          <IconButton size='small' color='error' onClick={() => remove(index)}>
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
                  size="small"
                  variant="tonal"
                  color="primary"
                  onClick={() => append({ name: '' })}
                >
                  Add More
                </Button>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button type='submit' variant='contained' disabled={loading}>
                  {loading && <CircularProgress size={20} color='inherit' />}
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
  )
}

export default AddLocationDialog
