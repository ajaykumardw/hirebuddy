'use client'

// React Imports
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Accordion from '@mui/material/Accordion'
import Radio from '@mui/material/Radio'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import FormLabel from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

import { Controller, useForm } from 'react-hook-form'

// Component Imports
import { Autocomplete, Checkbox, Chip, FormControl, FormHelperText, ListSubheader, Tooltip } from '@mui/material'


import { useEditor, EditorContent } from '@tiptap/react'

import { StarterKit } from '@tiptap/starter-kit'

import { Underline } from '@tiptap/extension-underline'

import { Placeholder } from '@tiptap/extension-placeholder'

import { TextAlign } from '@tiptap/extension-text-align'

import CustomTextField from '@core/components/mui/TextField'


import CustomIconButton from '@/@core/components/mui/IconButton'

import { getLocalizedUrl } from '@/utils/i18n'

import { yearsOpt } from '@/configs/customDataConfig'
import LocationAutocomplete from './LocationAutoComplete'

// Vars
const data = [
  {
    title: 'Standard 3-5 Days',
    meta: 'Free',
    content: 'Friday, 15 Nov - Monday, 18 Nov',
    isSelected: true,
    value: 'standard'
  },
  {
    title: 'Express',
    meta: '$5.00',
    content: 'Friday, 15 Nov - Sunday, 17 Nov',
    value: 'express'
  },
  {
    title: 'Overnight',
    meta: '$10.00',
    content: 'Friday, 15 Nov - Saturday, 16 Nov',
    value: 'overnight'
  }
]



const EditorToolbar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 p-3'>
      <Tooltip title='Bold' arrow>
        <CustomIconButton
          {...(editor.isActive('bold') && { color: 'primary' })}
          variant='outlined'
          size='small'
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <i className='tabler-bold' />
        </CustomIconButton>
      </Tooltip>
      <Tooltip title='Underline' arrow>
        <CustomIconButton
          {...(editor.isActive('underline') && { color: 'primary' })}
          variant='outlined'
          size='small'
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <i className='tabler-underline' />
        </CustomIconButton>
      </Tooltip>
      <Tooltip title='Italic' arrow>
        <CustomIconButton
          {...(editor.isActive('italic') && { color: 'primary' })}
          variant='outlined'
          size='small'
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <i className='tabler-italic' />
        </CustomIconButton>
      </Tooltip>
      <Tooltip title='Strike Through' arrow>
        <CustomIconButton
          {...(editor.isActive('strike') && { color: 'primary' })}
          variant='outlined'
          size='small'
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <i className='tabler-strikethrough' />
        </CustomIconButton>
      </Tooltip>
      <Tooltip title='Bullet List' arrow>
        <CustomIconButton
          {...(editor.isActive('bulletList') && { color: 'primary' })}
          variant='outlined'
          size='small'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <i className='tabler-list' />
        </CustomIconButton>
      </Tooltip>
      <Tooltip title='Ordered List' arrow>
        <CustomIconButton
          {...(editor.isActive('orderedList') && { color: 'primary' })}
          variant='outlined'
          size='small'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <i className='tabler-list-numbers' />
        </CustomIconButton>
      </Tooltip>
      <Tooltip title='Left' arrow>
        <CustomIconButton
          {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
          variant='outlined'
          size='small'
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <i className='tabler-align-left' />
        </CustomIconButton>
      </Tooltip>
      <Tooltip title='Center' arrow>
        <CustomIconButton
          {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
          variant='outlined'
          size='small'
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <i className='tabler-align-center' />
        </CustomIconButton>
      </Tooltip>
      <Tooltip title='Right' arrow>
        <CustomIconButton
          {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
          variant='outlined'
          size='small'
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <i className='tabler-align-right' />
        </CustomIconButton>
      </Tooltip>
      <Tooltip title='Justify' arrow>
        <CustomIconButton
          {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
          variant='outlined'
          size='small'
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          <i className='tabler-align-justified' />
        </CustomIconButton>
      </Tooltip>
    </div>
  )
}

const FormAddEditJob = ({ jobId, skillsData, industries, departments, jobData, locations, error }) => {
  // Vars
  const initialSelectedOption = data.filter(item => item.isSelected)[data.filter(item => item.isSelected).length - 1]
    .value

  // States
  const [minExpData, setMinExpData] = useState(yearsOpt || null);
  const [maxExpData, setMaxExpData] = useState(yearsOpt || null);
  const [fallbackSelected, setFallbackSelected] = useState([]);

  const [locationOptions, setLocationOptions] = useState(locations || []);
  const [loading, setLoading] = useState(false);
  const { lang: locale } = useParams()

  // const [industries, setIndustries] = useState(indu);
  // const [departments, setDepartments] = useState();

  // const [jobData, setJobData] = useState(jobData);

  // const content = this.props?.content || null;
  // const roleResContent = this.props?.rContent || null;

  const router = useRouter();
  const {data: session} = useSession();
  const token = session?.user?.token;

  const handleReset = () => {
    setCardData({
      fullName: '',
      phone: '',
      address: '',
      zipCode: '',
      landmark: '',
      city: '',
      country: '',
      addressType: '',
      number: '',
      name: '',
      expiry: '',
      cvv: ''
    })
  }

  // useEffect(() => {
  //   if(error){
  //     // console.log("jobData", jobData)
  //     sessionStorage.setItem('error', error);

  //     router.push('/jobs/list');
  //   }
  // }, [])


  const { control, handleSubmit, reset, setValue, watch, setError, formState: { errors } } = useForm({
    values: {
      jobTitle: jobData?.job_title || '',
      companyName: jobData?.company_name || '',
      location: jobData?.locations?.map(loc => loc.id) || [],
      totalPositions: jobData?.total_positions || '',
      industry: jobData?.industry_id || '',
      department: jobData?.department_id || '',
      description: jobData?.description || '',
      aboutCompany: jobData?.about_company || '',
      education: jobData?.education || [],
      minExp: yearsOpt?.find(exp => exp?.value == jobData?.min_exp)?.value || '',
      maxExp: yearsOpt?.find(exp => exp?.value == jobData?.max_exp)?.value || '',
      minCTC: jobData?.min_ctc || '',
      maxCTC: jobData?.max_ctc || '',
      roleAndResponsibility: jobData?.role_responsibility || '',
      skills: jobData?.skills?.map(skill => skill?.id) || [],
      gender: jobData?.gender || 'all',
    }
  });

  // Debounced input handler
  const debouncedInputHandler = useCallback((e, value) => {
    console.log("Debounced input value:", value);

    // Implement your input change handling logic here
    // For example, you can make an API call to fetch filtered options based on `value`

  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'outline-none'
      }
    },
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'pl-6'
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: 'pl-6'
          }
        }
      }),
      Placeholder.configure({
        placeholder: 'Write something here...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline,
    ],

    content: jobData?.description ?? ``,
    onUpdate: ({ editor }) => {
      setValue('description', editor.getHTML())
    }
  })

  const rolesResponseEditor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'outline-none'
      }
    },
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'pl-6'
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: 'pl-6'
          }
        }
      }),
      Placeholder.configure({
        placeholder: 'Write something here...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline,
    ],
    content: jobData?.role_responsibility ?? ``,
    onUpdate: ({ editor }) => {
      setValue('roleAndResponsibility', editor.getHTML())
    }
  })

  // console.log("editor", editor.getHTML());


  const onSubmit = async (data) => {

    // console.log("submitted data:", data)

    if(jobId){

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if(res.ok){

        sessionStorage.setItem('success', result.message);

        router.push(getLocalizedUrl('/jobs/list', locale));

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
        sessionStorage.setItem('error', result.message);

        router.push(getLocalizedUrl('/jobs/list', locale));

      }

    } else {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/store`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if(res.ok){

        sessionStorage.setItem('success', result.message);

        router.push(getLocalizedUrl('/jobs/list', locale));

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
        sessionStorage.setItem('error', result.message);

        router.push(getLocalizedUrl('/jobs/list', locale));

      }
    }

  }

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

      // const flatCities = data.flatMap((state) =>
      //   state.cities.map((city) => ({
      //     id: `${state.id}-${city.id}`,
      //     city: city.name,
      //     state_name: state.state_name
      //   }))
      // );

      setLocationOptions(data);
    } catch (err) {
      console.error('Error fetching cities', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(!locations){

      fetchCities();
    }

  }, [token, locations]);

  const handleInputChange = (event, value) => {
    if (value.length >= 3) {
      fetchCities(value);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* <Accordion expanded={expanded === 'panel1'} onChange={handleExpandChange('panel1')}> */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<i className='tabler-chevron-right' />}>
          <Typography>Job Details</Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails className='!pbs-6'>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                control={control}
                name='jobTitle'
                rules={{ required: 'This field is required' }}
                render={({field}) => (
                  <CustomTextField
                    fullWidth
                    label={<>Job Title <span className='text-error'>*</span></>}
                    error={!!errors?.jobTitle} helperText={errors?.jobTitle?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                control={control}
                name='companyName'
                rules={{ required: 'This field is required' }}
                render={({field}) => (
                  <CustomTextField
                    fullWidth
                    label={<>Company Name <span className='text-error'>*</span></>}
                    error={!!errors?.companyName} helperText={errors?.companyName?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <LocationAutocomplete
              control={control}
              errors={errors}
              locationOptions={locationOptions} // array of { id, city_name, state_name }
              fallbackSelected={fallbackSelected} // array
              setFallbackSelected={setFallbackSelected} // setState from parent
              loading={loading}
              handleInputChange={handleInputChange}
            />
            {/* <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                control={control}
                name="location"
                rules={{ required: 'This field is required' }}
                render={({ field }) => {

                  // Map selected IDs to full city objects from locationOptions or fallbackSelected
                  const selectedValues = useMemo(() => {

                    if (!field.value || !Array.isArray(field.value)) return [];

                    return field.value
                      .map(id => locationOptions.find(opt => opt.id === id) || fallbackSelected.find(opt => opt.id === id))
                      .filter(Boolean);
                  }, [field.value, locationOptions, fallbackSelected]);

                  // Keep track of any selected cities not currently in locationOptions (to keep them visible)
                  useEffect(() => {

                    const missingSelected = (field.value || [])
                      .map(id => locationOptions.find(opt => opt.id === id))
                      .filter(Boolean);

                    setFallbackSelected(prev => {
                      const combined = [...prev, ...missingSelected];

                      return combined.filter((v, i, a) => a.findIndex(x => x.id === v.id) === i);
                    });
                  }, [locationOptions, field.value]);

                  // Combine locationOptions + selectedValues (to ensure selected options are visible even if filtered out)
                  const combinedOptions = useMemo(() => {
                    const all = [...locationOptions, ...selectedValues];

                    return Array.from(new Map(all.map(item => [item.id, item])).values());
                  }, [locationOptions, selectedValues]);

                  // Group cities by state for toggling selection on group checkbox
                  const groupedCities = useMemo(() => {

                    return combinedOptions.reduce((acc, city) => {
                      if (!acc[city.state_name]) acc[city.state_name] = [];
                      acc[city.state_name].push(city);

                      return acc;
                    }, {});
                  }, [combinedOptions]);

                  // Toggle all cities of a group
                  const handleGroupToggle = (group) => {
                    const groupCities = groupedCities[group] || [];
                    const groupIds = groupCities.map(city => city.id);
                    const currentIds = field.value || [];

                    // Check if all group cities selected
                    const isFullySelected = groupCities.every(city => currentIds.includes(city.id));

                    const newSelection = isFullySelected
                      ? currentIds.filter(id => !groupIds.includes(id)) // deselect group
                      : Array.from(new Set([...currentIds, ...groupIds])); // select group

                    field.onChange(newSelection);
                  };

                  return (
                    <Autocomplete
                      fullWidth
                      multiple
                      loading={loading}
                      disableCloseOnSelect
                      groupBy={(option) => option.state_name}
                      options={combinedOptions}
                      value={selectedValues}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      getOptionLabel={(option) => option.city_name || ''}
                      onInputChange={(event, value, reason) => {
                        if (reason === 'input' && value.length >= 3) {
                          handleInputChange(event, value); // debounced fetch call
                        }
                      }}
                      onChange={(event, selectedOptions) => {
                        field.onChange(selectedOptions.map(opt => opt.id));
                      }}
                      renderGroup={(params) => {
                        const group = params.group;

                        const isAllSelected = groupedCities[group]?.every(city =>
                          (field.value || []).includes(city.id)
                        );

                        return [
                          <ListSubheader key={`header-${group}`} component="div" style={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox
                              size="small"
                              checked={!!isAllSelected}
                              indeterminate={
                                !isAllSelected &&
                                groupedCities[group]?.some(city => (field.value || []).includes(city.id))
                              }
                              onChange={() => handleGroupToggle(group)}
                              style={{ marginRight: 8 }}
                              onClick={e => e.stopPropagation()} // prevent autocomplete toggle on click
                            />
                            {group}
                          </ListSubheader>,
                          params.children
                        ];
                      }}
                      renderOption={(props, option, { selected }) => {
                        const { key, ...rest } = props;

                        return (
                          <li key={key} {...rest}>
                            <Checkbox
                              className="mie-2"
                              checked={selected}
                              onClick={e => e.stopPropagation()} // prevent autocomplete toggle on click
                            />
                            {option.city_name}
                          </li>
                        );
                      }}
                      renderInput={(params) => (
                        <CustomTextField
                          {...params}
                          label={<>Location <span className="text-error">*</span></>}
                          error={!!errors?.location}
                          helperText={errors?.location?.message}
                        />
                      )}
                    />
                  );
                }}
              />
            </Grid> */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                control={control}
                name='totalPositions'
                rules={{
                  required: 'This field is required',

                }}
                render={({field}) => (
                  <CustomTextField
                    fullWidth
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9+]/g, '');
                    }}
                    inputProps={{
                      maxLength: 10,
                    }}
                    label={<>Total Positions <span className='text-error'>*</span></>}
                    error={!!errors?.totalPositions} helperText={errors?.totalPositions?.message}
                    {...field}
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
            <Grid size={{ xs: 12  }}>
              <FormControl fullWidth>
                <FormLabel className='text-[var(--mui-palette-text-primary)] text-sm'>Description <span className="text-error">*</span></FormLabel>
                <Controller
                  control={control}
                  name='description'
                  rules={{ required: 'This field is required' }}
                  render={({field}) => (
                    <div className={`border rounded-md ${errors?.description && 'border-error'}`}>
                      <EditorToolbar editor={editor} />
                      <Divider className={errors?.description && 'border-error'} />
                      <EditorContent {...field} editor={editor} className='overflow-y-auto p-3' />
                    </div>
                  )}
                />
                {errors?.description && <FormHelperText error>{errors?.description?.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                control={control}
                name='aboutCompany'
                render={({field}) => (
                  <CustomTextField
                    fullWidth
                    label='About Company'
                    error={!!errors?.aboutCompany} helperText={errors?.aboutCompany?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                control={control}
                name='education'
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    select
                    required={false}
                    label={<>Education Level <span className='text-error'>*</span></>}
                    error={!!errors?.education}
                    helperText={errors?.education?.message}
                    {...field}
                    slotProps={{
                      select: {
                        multiple: true
                      }
                    }}
                  >
                    <MenuItem value='10th'>10th</MenuItem>
                    <MenuItem value='12th'>12th</MenuItem>
                    <MenuItem value='Diploma'>Diploma</MenuItem>
                    <MenuItem value='Graduate'>Graduate</MenuItem>
                    <MenuItem value='UG'>UG</MenuItem>
                    <MenuItem value='PG'>PG</MenuItem>
                    <MenuItem value='PHD'>PHD</MenuItem>
                  </CustomTextField>

                  // <Autocomplete
                  //   fullWidth
                  //   multiple
                  //   disableCloseOnSelect
                  //   options={skillsData || []}
                  //   value={skillsData?.filter(option => field.value?.includes(option.id)) || []}
                  //   getOptionLabel={(option) => option.name || ''}
                  //   onChange={(event, newValue) => {
                  //     field.onChange(newValue.map(option => option.id));
                  //   }}
                  //   isOptionEqualToValue={(option, value) => option.id === value.id}
                  //   renderTags={(value, getTagProps) =>
                  //     value.map((option, index) => {
                  //       const tagProps = getTagProps({ index });
                  //       const { key, ...rest } = tagProps;
                  //       return <Chip label={option.name} key={key} {...rest} />;
                  //     })
                  //   }
                  //   renderInput={(params) => (
                  //     <CustomTextField
                  //       {...params}
                  //       error={!!errors?.skills}
                  //       helperText={errors?.skills?.message}
                  //       label='Skills'
                  //     />
                  //   )}
                  // />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={Boolean(errors?.minExp || errors?.minExp)}>
                <FormLabel className='text-[var(--mui-palette-text-primary)] text-sm'>
                  Experience <span className="text-error">*</span>
                </FormLabel>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }} className='flex' gap={2} alignItems='center'>
                    <Controller
                      control={control}
                      name='minExp'
                      rules={{ required: 'This field is required' }}
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
                            <CustomTextField
                              {...params}
                              error={!!errors?.minExp}
                              helperText={errors?.minExp?.message}
                              placeholder='Min experience'
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
                      rules={{ required: 'This field is required' }}
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
                            <CustomTextField
                              {...params}
                              error={!!errors?.maxExp}
                              helperText={errors?.maxExp?.message}
                              placeholder='Max experience'
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={Boolean(errors?.minExp || errors?.minExp)}>
                <FormLabel className='text-[var(--mui-palette-text-primary)] text-sm'>
                  Annual Salary <span className="text-error">*</span>
                </FormLabel>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }} className='flex' gap={2} alignItems='center'>
                    <Controller
                      control={control}
                      name='minCTC'
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
                      render={({field}) => (
                        <CustomTextField
                          fullWidth
                          error={!!errors?.minCTC}
                          helperText={errors?.minCTC?.message}
                          onInput={(e) => {
                            e.target.value = e.target.value
                            .replace(/[^0-9.]/g, '')               // Remove non-digit and non-dot
                            .replace(/^\./, '')                    // Remove leading dot
                            .replace(/(\..*)\./g, '$1')            // Allow only first dot
                            .replace(/^(\d+)(\.\d{0,2})?.*$/, '$1$2'); // Limit to 2 decimal places

                          }}
                          placeholder='1.5'
                          {...field}
                        />

                      )}
                    />
                    to
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} className='flex' gap={2} alignItems='center'>
                    <Controller
                      control={control}
                      name='maxCTC'
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
                      render={({field}) => (
                        <CustomTextField
                          fullWidth
                          {...field}
                          error={!!errors?.maxCTC}
                          helperText={errors?.maxCTC?.message}
                          onInput={(e) => {
                            e.target.value = e.target.value
                            .replace(/[^0-9.]/g, '')               // Remove non-digit and non-dot
                            .replace(/^\./, '')                    // Remove leading dot
                            .replace(/(\..*)\./g, '$1')            // Allow only first dot
                            .replace(/^(\d+)(\.\d{0,2})?.*$/, '$1$2'); // Limit to 2 decimal places

                          }}
                          placeholder='2.5'
                        />
                      )}
                    />
                    Lacs
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* <Accordion expanded={expanded === 'panel2'} onChange={handleExpandChange('panel2')}> */}
      <Accordion>
        <AccordionSummary expandIcon={<i className='tabler-chevron-right' />}>
          <Typography>Roles & Responsibility</Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails className='!pbs-6'>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <FormLabel className='text-[var(--mui-palette-text-primary)] text-sm'>Roles & Responsibility</FormLabel>
              <Controller
                name='roleAndResponsibility'
                control={control}
                render={({ field }) => {
                  return (
                    <div className='border rounded-md'>
                      <EditorToolbar editor={rolesResponseEditor} />
                      <Divider />
                      <EditorContent {...field} placeholder='About company' editor={rolesResponseEditor} className='overflow-y-auto p-3' />
                    </div>
                  )
                }}
              />
            </FormControl>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* <Accordion expanded={expanded === 'panel3'} onChange={handleExpandChange('panel3')}> */}
      <Accordion>
        <AccordionSummary expandIcon={<i className='tabler-chevron-right' />}>
          <Typography>Additional Details</Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails className='!pbs-6'>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                control={control}
                name='skills'
                render={({ field }) => (
                  <Autocomplete
                    fullWidth
                    multiple
                    disableCloseOnSelect
                    options={skillsData || []}
                    value={skillsData?.filter(option => field.value?.includes(option.id)) || []}
                    getOptionLabel={(option) => option.name || ''}
                    onChange={(event, newValue) => {
                      field.onChange(newValue.map(option => option.id));
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const tagProps = getTagProps({ index });
                        const { key, ...rest } = tagProps;

                        return <Chip label={option.name} key={key} {...rest} />;
                      })
                    }
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        error={!!errors?.skills}
                        helperText={errors?.skills?.message}
                        label='Skills'
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs:12, sm: 6 }}>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors?.gender}>
                    <FormLabel className="text-[var(--mui-palette-text-primary)] text-sm">
                      Gender
                    </FormLabel>
                    <RadioGroup row {...field}>
                      <FormControlLabel value="all" control={<Radio />} label="All Candidates" />
                      <FormControlLabel value="male" control={<Radio />} label="Male Candidates" />
                      <FormControlLabel value="female" control={<Radio />} label="Female Candidates" />
                    </RadioGroup>
                    {errors?.gender && <FormHelperText error>{errors?.gender?.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
        <Divider />
        <AccordionDetails className='flex gap-4 pbs-6'>
        </AccordionDetails>
      </Accordion>
          <Button type='submit' variant='contained'>
            Submit
          </Button>
          <Button type='reset' variant='tonal' color='secondary' onClick={() => reset()}>
            Reset
          </Button>
    </form>
  )
}

export default FormAddEditJob
