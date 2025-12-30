import React, { useEffect, useState } from 'react';

import { useForm, Controller } from 'react-hook-form';

import { TextField, Autocomplete, Button } from '@mui/material';

import Grid from "@mui/material/Grid2";

import { useSession } from 'next-auth/react';

import DateFilterWithPicker from '@/components/DateFilterWithPicker';

const JobSearchForm = ({ yearsOpt, setJobsData, isCandidate, searching, setSearching }) => {
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      keyword: '',
      minExp: '',
      maxExp: '',
      location: []
    }
  });

  const [experience, setExperience] = useState('');
  const [minExpData, setMinExpData] = useState(yearsOpt || null);
  const [maxExpData, setMaxExpData] = useState(yearsOpt || null);
  const [location, setLocation] = useState('');
  const [keyword, setKeyword] = useState('');
  const [locationOptions, setLocationOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const {data:session} = useSession();
  const token = session?.user?.token;

  const fetchCities = async (searchTerm = '') => {

    if(!token) return null;

    setLoading(true);

    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations?search=${searchTerm}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      setLocationOptions(data);
    } catch (err) {
      console.error('Error fetching cities', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, [token]);


  const selectedMinExp = watch('minExp')
  const selectedMaxExp = watch('maxExp')


  useEffect(() => {

    // console.log('selectedMinExp 1', selectedMinExp)

    if(selectedMinExp) {

      // console.log('selectedMinExp 2', selectedMinExp)

      const newData = yearsOpt.filter(opt => Number(opt.value) >= Number(selectedMinExp))

      setMaxExpData(newData);
    } else {

      setMaxExpData(yearsOpt)
    }

    // console.log('selectedMaxExp 1', selectedMaxExp)
    if(selectedMaxExp) {

      // console.log('selectedMaxExp 2', selectedMaxExp)

      const newData = yearsOpt.filter(opt => Number(opt.value) <= Number(selectedMaxExp))

      setMinExpData(newData);
    } else {

      setMinExpData(yearsOpt)
    }

  },[selectedMinExp, selectedMaxExp])

  const handleInputChange = (event, value) => {
    if (value.length >= 3) {
      fetchCities(value);
    }
  };

  const selectedIds = watch('location') || [];

  // Submit handler to fetch job data
  const onSubmit = async (data) => {
    console.log('Form data:', data);

    if(!token) return;

    setSearching(true);

    if(token){

      const res = await fetch(isCandidate ? `${process.env.NEXT_PUBLIC_API_URL}/candidate/jobs` : `${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if(res.ok){

        const data = await res.json();

        console.log("data:", data);
        setJobsData(data.data);

        // return data;
      } else {

        setJobsData([])

        // return [];
      }

    } else{
      setJobsData([])
    }

    setSearching(false);

    // if(data?.keyword || data?.minExp || data?.maxExp || data?.location.length > 0 ){
    //   setJobsData([]);
    //   console.log("keyword", data)
    // }
    // Fetch job data here (for example, you can make an API call)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={6} className='items-start'>
        <DateFilterWithPicker control={control} errors={errors} setValue={setValue} />
        {/* Keyword / Designation / Companies */}
        <Grid size={{ xs:12, sm:6, md:2 }}>
          <Controller
            name='keyword'
            control={control}
            render={({field}) => (

              <TextField
                {...field}
                fullWidth
                label="Job Title/Job Search"
                size="small"
                {...(errors.keyword && { error: true, helperText: errors.keyword.message })}
              />

            )}
          />
        </Grid>

        {/* Experience */}
        {/* <Grid size={{ xs:12, sm:6, md:3 }}>
          <Controller
            name="experience"
            control={control}
            // rules={{ required: 'Experience is required' }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                fullWidth
                size="small"
                options={yearsOpt || []}
                getOptionLabel={(year) => year?.value === '0' ? 'Fresher (less than 1 year)' : year?.label || ''}
                value={yearsOpt.find((opt) => opt.id === experience) || null}
                // onChange={(e, value) => {
                //   setExperience(value?.id || '');
                //   setValue('experience', value?.id || '');
                // }}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select experience"
                    error={!!errors.experience}
                    helperText={errors.experience ? errors.experience.message : ''}
                  />
                )}
              />
            )}
          />
        </Grid> */}

        <Grid size={{ xs:12, sm:6, md:4 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }} className='flex' gap={2} alignItems='center'>
              <Controller
                control={control}
                name='minExp'
                render={({field}) => (
                  <Autocomplete
                    fullWidth
                    {...field}
                    options={minExpData || []}
                    value={
                      yearsOpt.find(option => option.value === field.value) || null
                    }
                    getOptionKey={option => option.value}
                    getOptionLabel={(option) => option.label || ''}
                    onChange={(event, value) => {
                      field.onChange(value?.value || '')
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size='small'
                        error={!!errors?.minExp}
                        helperText={errors?.minExp?.message}
                        label='Min experience'
                      />
                    )}
                  />
                )}
              />
              to
            </Grid>
            {/* <Grid size={{ xs: 12, sm: 0 }}>to</Grid> */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                control={control}
                name='maxExp'
                render={({field}) => (
                  <Autocomplete
                    fullWidth
                    {...field}
                    options={maxExpData || []}
                    value={
                      yearsOpt.find(option => option.value === field.value) || null
                    }
                    getOptionKey={option => option.value}
                    getOptionLabel={(option) => option.label || ''}
                    onChange={(event, value) => {
                      field.onChange(value?.value || '')
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Max experience"
                        size='small'
                        error={!!errors?.maxExp}
                        helperText={errors?.maxExp?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Location */}
        <Grid size={{ xs:12, sm:6, md:3 }}>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                fullWidth
                loading={loading}
                disableCloseOnSelect
                options={locationOptions}
                groupBy={(option) => option.state_name}
                value={selectedIds?.map(id => locationOptions.find(opt => opt.id === id))}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.city_name}
                onChange={(e, newValue) => {
                  field.onChange(newValue.map(opt => opt.id));
                }}
                onInputChange={(e, value, reason) => {
                  if (reason === 'input' && value.length >= 3) {
                    handleInputChange(e, value);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select location"
                    size='small'
                    error={!!errors?.location}
                    helperText={errors?.location ? errors?.location?.message : ''}
                  />
                )}
              />
            )}
          />
          {/* <TextField
            fullWidth
            label="Enter location"
            size="small"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            {...(errors.location && { error: true, helperText: errors.location.message })}
          /> */}
        </Grid>

        {/* Submit Button */}
        <Grid size={{ xs:12 }} className="flex justify-end">
          <Button variant="contained" type="submit" disabled={searching}>
            Search
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default JobSearchForm;
