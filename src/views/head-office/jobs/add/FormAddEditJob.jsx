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

import { Controller, useFieldArray, useForm } from 'react-hook-form'

// Component Imports
import { Autocomplete, Card, CardActions, CardContent, CardHeader, Checkbox, Chip, createFilterOptions, FormControl, FormHelperText, IconButton, ListSubheader, Tab, Tooltip } from '@mui/material'


import { useEditor, EditorContent } from '@tiptap/react'

import { StarterKit } from '@tiptap/starter-kit'

import { Underline } from '@tiptap/extension-underline'

import { Placeholder } from '@tiptap/extension-placeholder'

import { TextAlign } from '@tiptap/extension-text-align'

import { TabContext, TabList, TabPanel } from '@mui/lab'

import CustomTextField from '@core/components/mui/TextField'

import CustomIconButton from '@/@core/components/mui/IconButton'

import { getLocalizedUrl } from '@/utils/i18n'

import { qualificationData, yearsOpt } from '@/configs/customDataConfig'

import LocationAutocomplete from './LocationAutoComplete'
import SkillSearchOnly from '@/components/SkillSearchOnly'

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

const filter = createFilterOptions()

async function createDepartment(name, token) {
  // Replace with your actual API call
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/departments/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error('Failed to create department');

  return res.json();
}

const FormAddEditJob = ({ jobId, branchData, skillsData, industries, departments, jobData, locations, error }) => {
  // Vars
  const initialSelectedOption = data.filter(item => item.isSelected)[data.filter(item => item.isSelected).length - 1]
    .value

  // States
  const [minExpData, setMinExpData] = useState(yearsOpt || null);
  const [maxExpData, setMaxExpData] = useState(yearsOpt || null);
  const [fallbackSelected, setFallbackSelected] = useState([]);
  const [tabValue, setTabValue] = useState('job_details')
  const [selectedSourceSkills, setSelectedSourceSkills] = useState([]);
  const [selectedSearchSkills, setSelectedSearchSkills] = useState([]);

  const [locationOptions, setLocationOptions] = useState(locations || []);
  const [loading, setLoading] = useState(false);
  const { lang: locale } = useParams()

  // const [industries, setIndustries] = useState(indu);
  const [departmentsData, setDepartments] = useState(departments);

  useEffect(() => {

    setSelectedSourceSkills(jobData?.source_criteria?.skill_ids ? skillsData.filter(skill => JSON.parse(jobData?.source_criteria?.skill_ids).includes(skill.id)) : [])
    setSelectedSearchSkills(jobData?.search_criteria?.skill_ids ? skillsData.filter(skill => JSON.parse(jobData?.search_criteria?.skill_ids).includes(skill.id)) : [])

  }, [skillsData])

  // const [jobData, setJobData] = useState(jobData);

  // const content = this.props?.content || null;
  // const roleResContent = this.props?.rContent || null;

  const router = useRouter();
  const { data: session } = useSession();
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

  const fetchLocations = async () => {
    if (token) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all-locations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();

        setLocationOptions(data?.all_locations);
      }

    }
  }

  useEffect(() => {
    fetchLocations();
  }, [token]);

  // useEffect(() => {
  //   if(error){
  //     // console.log("jobData", jobData)
  //     sessionStorage.setItem('error', error);

  //     router.push('/jobs/list');
  //   }
  // }, [])

  console.log("job data:", jobData);


  const { control, handleSubmit, reset, setValue, watch, getValues, setError, formState: { errors } } = useForm({
    values: {
      jobTitle: jobData?.job_title || '',
      companyName: jobData?.company_name || '',

      // location: jobData?.locations?.map(loc => loc.id) || [],
      manager: jobData?.locations?.length > 0 ? jobData?.locations[0]?.pivot?.manager || '' : '',

      locations: jobData?.locations?.length > 0 ? jobData?.locations?.map((loc) => ({
        locationId: loc.id || '',
        manager: loc?.pivot?.manager || ''
      })) : [{
        locationId: '',
        manager: ''
      }],
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
      additional_benefits: jobData?.additional_benefits || '',
      source_criteria: jobData?.source_criteria ? {
        min_exp: yearsOpt?.find(exp => exp?.value == jobData?.source_criteria?.min_exp)?.value || '',
        max_exp: yearsOpt?.find(exp => exp?.value == jobData?.source_criteria?.max_exp)?.value || '',
        preferred_industry_ids: jobData?.source_criteria?.preferred_industry_ids && JSON.parse(jobData?.source_criteria?.preferred_industry_ids) || '',
        preferred_industry: jobData?.source_criteria?.preferred_industry || '',
        min_qualification: jobData?.source_criteria?.min_qualification || '',
        min_age: jobData?.source_criteria?.min_age || '',
        max_age: jobData?.source_criteria?.max_age || '',
        skill_ids: jobData?.source_criteria?.skill_ids && JSON.parse(jobData?.source_criteria?.skill_ids) || '',
        company_sources: jobData?.source_criteria?.company_sources || '',
        preferred_location_ids: jobData?.source_criteria?.preferred_location_ids && JSON.parse(jobData?.source_criteria?.preferred_location_ids) || '',
        min_salary: jobData?.source_criteria?.min_salary || '',
        max_salary: jobData?.source_criteria?.max_salary || '',
        min_increment: jobData?.source_criteria?.min_increment || '',
        max_increment: jobData?.source_criteria?.max_increment || '',
        same_for_search: jobData?.source_criteria?.same_for_search || false,
      } : {},
      search_criteria: jobData?.search_criteria ? {
        min_exp: yearsOpt?.find(exp => exp?.value == jobData?.search_criteria?.min_exp)?.value || '',
        max_exp: yearsOpt?.find(exp => exp?.value == jobData?.search_criteria?.max_exp)?.value || '',
        preferred_industry_ids: jobData?.search_criteria?.preferred_industry_ids && JSON.parse(jobData?.search_criteria?.preferred_industry_ids) || '',
        preferred_industry: jobData?.search_criteria?.preferred_industry || '',
        min_qualification: jobData?.search_criteria?.min_qualification || '',
        min_age: jobData?.search_criteria?.min_age || '',
        max_age: jobData?.search_criteria?.max_age || '',
        skill_ids: jobData?.search_criteria?.skill_ids && JSON.parse(jobData?.search_criteria?.skill_ids) || '',
        company_sources: jobData?.search_criteria?.company_sources || '',
        preferred_location_ids: jobData?.search_criteria?.preferred_location_ids && JSON.parse(jobData?.search_criteria?.preferred_location_ids) || '',
        min_salary: jobData?.search_criteria?.min_salary || '',
        max_salary: jobData?.search_criteria?.max_salary || '',
      } : {},
    }
  });

  const { fields: locationFields, append: appendLocationFields, remove: removeLocationFields } = useFieldArray({
    control,
    name: 'locations',
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

  const aboutCompanyEditor = useEditor({
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

    content: jobData?.about_company ?? ``,
    onUpdate: ({ editor }) => {
      setValue('aboutCompany', editor.getHTML())
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

  const additionalBenefitsEditor = useEditor({
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
    content: jobData?.additional_benefits ?? ``,
    onUpdate: ({ editor }) => {
      setValue('additional_benefits', editor.getHTML())
    }
  })

  const preferredIndustryEditor = useEditor({
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

    content: jobData?.source_criteria?.preferred_industry ?? ``,
    onUpdate: ({ editor }) => {
      setValue('source_criteria.preferred_industry', editor.getHTML())
    }
  })

  const keySkillsEditor = useEditor({
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

    content: jobData?.source_criteria?.skills ?? ``,
    onUpdate: ({ editor }) => {
      setValue('source_criteria.skills', editor.getHTML())
    }
  })

  const companySourcesEditor = useEditor({
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

    content: jobData?.source_criteria?.company_sources ?? ``,
    onUpdate: ({ editor }) => {
      setValue('source_criteria.company_sources', editor.getHTML())
    }
  })

  // console.log("editor", editor.getHTML());


  const onSubmit = async (data) => {

    console.log("submitted data:", data)

    // return

    if (jobId) {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {

        sessionStorage.setItem('success', result.message);

        router.push(getLocalizedUrl('/head-office/jobs/list', locale));

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
        sessionStorage.setItem('error', result.message);

        router.push(getLocalizedUrl('/head-office/jobs/list', locale));

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

      if (res.ok) {

        sessionStorage.setItem('success', result.message);

        router.push(getLocalizedUrl('/head-office/jobs/list', locale));

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
        sessionStorage.setItem('error', result.message);

        router.push(getLocalizedUrl('/head-office/jobs/list', locale));

      }
    }

  }

  const selectedMinExp = watch('minExp')
  const selectedMaxExp = watch('maxExp')


  useEffect(() => {

    // console.log('selectedMinExp 1', selectedMinExp)

    if (selectedMinExp) {

      // console.log('selectedMinExp 2', selectedMinExp)

      const newData = yearsOpt.filter(opt => Number(opt.value) >= Number(selectedMinExp))

      setMaxExpData(newData);
    } else {

      setMaxExpData(yearsOpt)
    }

    // console.log('selectedMaxExp 1', selectedMaxExp)
    if (selectedMaxExp) {

      // console.log('selectedMaxExp 2', selectedMaxExp)

      const newData = yearsOpt.filter(opt => Number(opt.value) <= Number(selectedMaxExp))

      setMinExpData(newData);
    } else {

      setMinExpData(yearsOpt)
    }

  }, [selectedMinExp, selectedMaxExp])



  const fetchCities = async (searchTerm = '') => {

    if (!token) return null;

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
    if (!locations) {

      fetchCities();
    }

  }, [token, locations]);

  useEffect(() => {
    if (branchData.length && jobId) {
      const matchingIds = branchData
        .filter(branch =>
          Array.isArray(branch.assigned_jobs) &&
          branch.assigned_jobs.some(job => String(job.id) === String(jobId))
        )
        .map(branch => branch.id);

      setValue('selectedBranchIds', matchingIds);
    }
  }, [branchData, jobId, setValue]);

  const handleInputChange = (event, value) => {
    if (value.length >= 3) {
      fetchCities(value);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleSameForSearch = (e) => {
    const isChecked = e.target.checked;

    setValue('search_criteria', { ...getValues('source_criteria'), same_for_search: isChecked });
    setSelectedSearchSkills(selectedSourceSkills);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* <Card> */}
      {/* <CardHeader title={jobId ? 'Edit Job' : 'Post New Job'} />
        <Divider /> */}
      <Typography variant='h4' className='mbe-1'>{jobId ? 'Edit Job' : 'Post New Job'}</Typography>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<i className='tabler-chevron-right' />}>
          <div
            onClick={(e) => e.stopPropagation()} // prevent collapse on tab click
          >
            <TabContext value={tabValue}>
              <TabList variant='scrollable' onChange={handleTabChange} className='border-be'>
                <Tab label='Job Details' value='job_details' />
                {/* <Tab label='Roles & Responsibility' value='role_responsibility' />
            <Tab label='Additional Details' value='additional_details' />
            <Tab label='Assign to Branches' value='assign_branches' /> */}
                <Tab label='Source Criteria' value='source_criteria' />
                <Tab label='Search Criteria' value='search_criteria' />
              </TabList>
            </TabContext>
          </div>
        </AccordionSummary>
        <Divider />
        <AccordionDetails className='!pbs-6'>
          <TabContext value={tabValue}>
            {/* <Accordion expanded={expanded === 'panel1'} onChange={handleExpandChange('panel1')}> */}
            {/* <CardContent> */}
            <TabPanel value='job_details'>
              <Grid container spacing={6}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    control={control}
                    name='jobTitle'
                    rules={{ required: 'This field is required' }}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        label={<>Job Title/Search <span className='text-error'>*</span></>}
                        error={!!errors?.jobTitle} helperText={errors?.jobTitle?.message}
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Controller
                    control={control}
                    name='companyName'
                    rules={{ required: 'This field is required' }}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        label={<>Company Name <span className='text-error'>*</span></>}
                        error={!!errors?.companyName} helperText={errors?.companyName?.message}
                        {...field}
                      />
                    )}
                  />
                </Grid>
                {/* <LocationAutocomplete
                    control={control}
                    errors={errors}
                    locationOptions={locationOptions} // array of { id, city_name, state_name }
                    fallbackSelected={fallbackSelected} // array
                    setFallbackSelected={setFallbackSelected} // setState from parent
                    loading={loading}
                    handleInputChange={handleInputChange}
                  /> */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Controller
                    control={control}
                    name='manager'
                    rules={{ required: 'This field is required' }}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        label={<>Manager <span className='text-error'>*</span></>}
                        error={!!errors?.manager} helperText={errors?.manager?.message}
                        {...field}
                      />
                    )}
                  />
                </Grid>
                {locationFields.map((item, index) => (
                  <Grid size={{ xs: 12, sm: 6 }} className='repeater-item p-4 border rounded' key={index}>
                    <div className='flex gap-2 items-center'>
                      <Grid container spacing={5} className='flex-1'>
                        <Grid size={{ xs: 12 }}>
                          <Controller name={`locations[${index}].locationId`} control={control}
                            rules={{ required: 'This field is required.' }}
                            render={({ field }) => (
                              <Autocomplete
                                fullWidth
                                loading={locationOptions.length === 0}
                                value={locationOptions && locationOptions.length > 0 && locationOptions.find(location => location.id === field.value) || null}
                                options={locationOptions || []}
                                getOptionKey={option => option.id}
                                getOptionLabel={(location) => location.city_name + (location?.state?.state_name ? ', ' + location.state.state_name : location?.state_name ? ', ' + location.state_name : '') || ''}
                                getOptionDisabled={(option) =>
                                  locationFields.some((f, i) => i !== index && f.locationId === option.id)
                                }
                                onChange={(event, value) => {
                                  field.onChange(value?.id || '')
                                }}
                                renderInput={(params) => (
                                  <CustomTextField
                                    {...params}
                                    label={<>Location <span className='text-error'>*</span></>}
                                    error={!!errors.locations?.[index]?.locationId}
                                    helperText={errors?.locations?.[index]?.locationId?.message}
                                  />
                                )}
                              />
                            )}
                          />
                        </Grid>
                        {index === 0 &&
                          <Grid size={{ xs: 12 }}>
                            <Button
                              size='small'
                              variant="tonal"
                              color="primary"
                              onClick={() =>
                                appendLocationFields({
                                  name: '',
                                  manager: '',
                                })
                              }
                            >
                              Add More Locations
                            </Button>
                          </Grid>
                        }
                      </Grid>
                      {index !== 0 && (
                        <>
                          <Divider orientation='vertical' flexItem />
                          <div className='flex flex-col justify-start'>
                            <IconButton size='small' color='error' onClick={() => removeLocationFields(index)}>
                              <i className='tabler-x text-2xl' />
                            </IconButton>
                          </div>
                        </>
                      )}
                    </div>
                  </Grid>
                ))}
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
                    render={({ field }) => (
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
                  <Controller
                    name="department"
                    control={control}
                    rules={{ required: 'This field is required.' }}
                    render={({ field }) => (
                      <Autocomplete
                        fullWidth
                        freeSolo
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        value={
                          departmentsData?.find(dept => dept.id === field.value) ||
                          (typeof field.value === 'string' ? field.value : null)
                        }
                        options={departmentsData || []}
                        getOptionLabel={(option) => {
                          if (typeof option === 'string') return option;
                          if (option.inputValue) return `Click to Add "${option.inputValue}"`;

                          return option.name || '';
                        }}
                        filterOptions={(options, params) => {
                          const filtered = filter(options, params);

                          const isExisting = options.some(
                            (option) =>
                              typeof option !== 'string' &&
                              option.name.toLowerCase() === params.inputValue.toLowerCase()
                          );

                          if (params.inputValue !== '' && !isExisting) {
                            filtered.push({
                              inputValue: params.inputValue,
                              name: `Add "${params.inputValue}"`,
                            });
                          }

                          return filtered;
                        }}
                        isOptionEqualToValue={(option, value) => {
                          if (typeof value === 'string') return option.name === value;
                          if (option.inputValue) return option.inputValue === value.inputValue;

                          return option.id === value.id;
                        }}
                        onChange={async (event, newValue) => {
                          if (typeof newValue === 'string') {
                            // User typed and selected raw string
                            try {
                              const created = await createDepartment(newValue, token);

                              field.onChange(created.department.id);
                              setDepartments((prev) => [...(prev || []), created.department]);
                            } catch (err) {
                              console.error('Create failed', err);
                            }
                          } else if (newValue?.inputValue) {
                            // User clicked on "Add 'XYZ'"
                            try {
                              const created = await createDepartment(newValue.inputValue, token);

                              field.onChange(created.department.id);
                              setDepartments((prev) => [...(prev || []), created.department]);
                            } catch (err) {
                              console.error('Create failed', err);
                            }
                          } else {
                            // User selected existing department
                            field.onChange(newValue?.id || '');
                          }
                        }}
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            label={<>Department <span className="text-error">*</span></>}
                            error={!!errors.department}
                            helperText={errors?.department?.message}
                          />
                        )}
                      />
                    )}
                  />
                  {/* <Controller name="department" control={control}
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
                    /> */}
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <FormLabel className={`${errors?.description ?? 'text-[var(--mui-palette-text-primary)]'} text-sm`} error={errors?.description}>Description <span className="text-error">*</span></FormLabel>
                    <Controller
                      control={control}
                      name='description'
                      rules={{ required: 'This field is required' }}
                      render={({ field }) => (
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
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <FormLabel className={`${errors?.aboutCompany ?? 'text-[var(--mui-palette-text-primary)]'} text-sm`} error={errors?.aboutCompany}>About Company</FormLabel>
                    <Controller
                      control={control}
                      name='aboutCompany'
                      render={({ field }) => (
                        <div className={`border rounded-md ${errors?.aboutCompany && 'border-error'}`}>
                          <EditorToolbar editor={aboutCompanyEditor} />
                          <Divider className={errors?.aboutCompany && 'border-error'} />
                          <EditorContent {...field} editor={aboutCompanyEditor} className='overflow-y-auto p-3' />
                        </div>
                      )}
                    />
                    {errors?.aboutCompany && <FormHelperText error>{errors?.aboutCompany?.message}</FormHelperText>}
                  </FormControl>
                </Grid>
                {/* <Grid size={{ xs: 12, sm: 6 }}>
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
                  </Grid> */}
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
                          render={({ field }) => (
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
                          render={({ field }) => (
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
                          render={({ field }) => (
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
                          render={({ field }) => (
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
            </TabPanel>
            <TabPanel value='source_criteria'>
              <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' className='font-medium'>
                    1. Experience
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth error={Boolean(errors?.minExp || errors?.minExp)}>
                    <FormLabel className='text-[var(--mui-palette-text-primary)] text-sm'>
                      Experience
                    </FormLabel>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }} className='flex' gap={2} alignItems='center'>
                        <Controller
                          control={control}
                          name='source_criteria.min_exp'
                          render={({ field }) => (
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
                                  error={!!errors?.source_criteria?.min_exp}
                                  helperText={errors?.source_criteria?.min_exp?.message}
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
                          name='source_criteria.max_exp'
                          render={({ field }) => (
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
                                  error={!!errors?.source_criteria?.max_exp}
                                  helperText={errors?.source_criteria?.max_exp?.message}
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
                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' className='font-medium'>
                    2. Preferred Industry
                  </Typography>
                </Grid>
                {/* <Grid size={{ xs: 12 }}>
                  <Controller
                    control={control}
                    name='source_criteria.preferred_industry_ids'
                    render={({ field }) => (
                      <Autocomplete
                        fullWidth
                        multiple
                        value={
                          industries && industries?.filter(ind => field?.value?.includes(ind.id)) || []
                        }
                        options={industries || []}
                        groupBy={option => option.category || ''}
                        getOptionKey={option => option.id}
                        getOptionLabel={(industry) => industry.name || ''}
                        onChange={(event, selectedOptions) => {
                          const selectedIds = selectedOptions.map(opt => opt.id);
                          const selectedNames = selectedOptions.map(opt => opt.name).join(', ');

                          field.onChange(selectedIds); // update the array of selected IDs

                          // Set the `preferred_industry` field with names
                          setValue('source_criteria.preferred_industry', selectedNames);
                        }}
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            label='Select Industry'
                            error={!!errors.source_criteria?.preferred_industry_ids}
                            helperText={errors?.source_criteria?.preferred_industry_ids?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <FormLabel className={`${errors?.source_criteria?.preferred_industry ?? 'text-[var(--mui-palette-text-primary)]'} text-sm`} error={errors?.preferred_industry}>Preferred Industry</FormLabel>
                    <Controller
                      control={control}
                      name='source_criteria.preferred_industry'
                      render={({ field }) => (
                        <div className={`border rounded-md ${errors?.source_criteria?.preferred_industry && 'border-error'}`}>
                          <EditorToolbar editor={preferredIndustryEditor} />
                          <Divider className={errors?.source_criteria?.preferred_industry && 'border-error'} />
                          <EditorContent {...field} editor={preferredIndustryEditor} className='overflow-y-auto p-3' />
                        </div>
                      )}
                    />
                    {errors?.source_criteria?.preferred_industry && <FormHelperText error>{errors?.source_criteria?.preferred_industry?.message}</FormHelperText>}
                  </FormControl>
                </Grid> */}
                <Grid size={{ xs: 12 }}>
                  <Controller
                    control={control}
                    name='source_criteria.preferred_industry_ids'
                    render={({ field }) => (
                      <Autocomplete
                        fullWidth
                        multiple
                        value={industries?.filter(ind => field?.value?.includes(ind.id)) || []}
                        options={industries || []}
                        groupBy={option => option.category || ''}
                        getOptionKey={option => option.id}
                        getOptionLabel={(industry) => industry.name || ''}
                        onChange={(event, selectedOptions, reason, details) => {
                          const selectedIds = selectedOptions.map(opt => opt.id);
                          const selectedNames = selectedOptions.map(opt => opt.name);

                          // Update the selected IDs in form
                          field.onChange(selectedIds);

                          if (!preferredIndustryEditor) return;

                          // When user adds an industry
                          if (reason === 'selectOption' && details?.option?.name) {
                            const newlyAdded = details.option.name;
                            const { from } = preferredIndustryEditor.state.selection;
                            const textBefore = preferredIndustryEditor.state.doc.textBetween(0, from, '\n');
                            const prefix = textBefore.trim().length > 0 ? ', ' : '';

                            preferredIndustryEditor
                              .chain()
                              .focus()
                              .insertContent(`${prefix}${newlyAdded}`)
                              .run();
                          }

                          // When user removes one
                          else if (reason === 'removeOption' && details?.option?.name) {
                            const removedName = details.option.name;

                            // Get the current editor content
                            const currentContent = preferredIndustryEditor.getText();

                            // Create a regex to safely remove that name (case insensitive, with optional comma/space)
                            const updatedText = currentContent
                              .replace(new RegExp(`\\b${removedName}\\b,?\\s*`, 'gi'), '')
                              .trim()
                              .replace(/(^,|,$)/g, '')
                              .trim();

                            // Replace editor content with updated text
                            preferredIndustryEditor.commands.setContent(updatedText);
                          }

                          // When user clears all
                          else if (reason === 'clear') {
                            preferredIndustryEditor.commands.clearContent();
                          }
                        }}

                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            label='Select Industry'
                            error={!!errors.source_criteria?.preferred_industry_ids}
                            helperText={errors?.source_criteria?.preferred_industry_ids?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <FormLabel
                      className={`${
                        errors?.source_criteria?.preferred_industry
                          ? 'text-error'
                          : 'text-[var(--mui-palette-text-primary)]'
                      } text-sm`}
                    >
                      Preferred Industry
                    </FormLabel>

                    <Controller
                      control={control}
                      name='source_criteria.preferred_industry'
                      render={({ field }) => (
                        <div
                          className={`border rounded-md ${
                            errors?.source_criteria?.preferred_industry && 'border-error'
                          }`}
                        >
                          <EditorToolbar editor={preferredIndustryEditor} />
                          <Divider
                            className={
                              errors?.source_criteria?.preferred_industry && 'border-error'
                            }
                          />
                          <EditorContent
                            {...field}
                            editor={preferredIndustryEditor}
                            className='overflow-y-auto p-3'
                          />
                        </div>
                      )}
                    />

                    {errors?.source_criteria?.preferred_industry && (
                      <FormHelperText error>
                        {errors.source_criteria.preferred_industry.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' className='font-medium'>
                    3. Educational Qualification
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    control={control}
                    name='source_criteria.min_qualification'
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        select
                        required={false}
                        label={<>Minimum Qualification</>}
                        error={!!errors?.source_criteria?.min_qualification}
                        helperText={errors?.source_criteria?.min_qualification?.message}
                        {...field}
                      >
                        {qualificationData.map((qual) => (
                          <MenuItem key={qual.value} value={qual.value}>{qual.label}</MenuItem>
                        ))}

                        {/*
                        <MenuItem value='1'>10th</MenuItem>
                        <MenuItem value='2'>12th</MenuItem>
                        <MenuItem value='3'>Diploma</MenuItem>
                        <MenuItem value='4'>Graduate</MenuItem>
                        <MenuItem value='5'>UG</MenuItem>
                        <MenuItem value='6'>PG</MenuItem>
                        <MenuItem value='7'>PHD</MenuItem>*/}

                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' className='font-medium'>
                    4. Age Criteria
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    control={control}
                    name='source_criteria.min_age'
                    rules={{
                      validate: {
                        isPositive: (value) => {
                          if (!value) return true;

                          if (isNaN(value) || Number(value) <= 0) {
                            return 'Please enter a valid positive number';
                          }

                          return true;
                        },
                        isLessThanMaxAge: (value) => {
                          if (!value) return true;

                          const maxAge = getValues('source_criteria.max_age');

                          if (maxAge && !isNaN(maxAge) && Number(value) >= Number(maxAge)) {
                            return 'Min age must be less than Max age';
                          }

                          return true;
                        }
                      }
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        label={<>Min. Age</>}
                        error={!!errors?.source_criteria?.min_age}
                        helperText={errors?.source_criteria?.min_age?.message}
                        {...field}
                        onInput={(e) => {
                          let val = e.target.value.replace(/[^0-9]/g, '');

                          if (val !== '' && Number(val) > 100) val = '100';
                          e.target.value = val;
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    control={control}
                    name='source_criteria.max_age'
                    rules={{
                      validate: {
                        isPositive: (value) => {
                          if (!value) return true;

                          if (isNaN(value) || Number(value) <= 0) {
                            return 'Please enter a valid positive number';
                          }

                          return true;
                        },
                        isGreaterThanMinAge: (value) => {
                          if (!value) return true;

                          const minAge = getValues('source_criteria.min_age');

                          if (minAge && !isNaN(minAge) && Number(value) <= Number(minAge)) {
                            return 'Max age must be greater than Min age';
                          }

                          return true;
                        }
                      }
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        label={<>Max. Age</>}
                        error={!!errors?.source_criteria?.max_age}
                        helperText={errors?.source_criteria?.max_age?.message}
                        {...field}
                        onInput={(e) => {
                          let val = e.target.value.replace(/[^0-9]/g, '');

                          if (val !== '' && Number(val) > 100) val = '100';
                          e.target.value = val;
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' className='font-medium'>5. Key Skills - Keywords</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <SkillSearchOnly
                    control={control}
                    name='source_criteria.skill_ids'
                    errors={errors}
                    selectedSkills={selectedSourceSkills}
                    setSelectedSkills={setSelectedSourceSkills}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' className='font-medium'>6. Companies to source from</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <FormLabel className={`${errors?.source_criteria?.company_sources ?? 'text-[var(--mui-palette-text-primary)]'} text-sm`} error={!!errors?.source_criteria?.company_sources}>Company Sources</FormLabel>
                    <Controller
                      control={control}
                      name='source_criteria.company_sources'
                      render={({ field }) => (
                        <div className={`border rounded-md ${errors?.source_criteria?.company_sources && 'border-error'}`}>
                          <EditorToolbar editor={companySourcesEditor} />
                          <Divider className={errors?.source_criteria?.company_sources && 'border-error'} />
                          <EditorContent {...field} editor={companySourcesEditor} className='overflow-y-auto p-3' />
                        </div>
                      )}
                    />
                    {errors?.source_criteria?.company_sources && <FormHelperText error>{errors?.source_criteria?.company_sources?.message}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    control={control}
                    name='source_criteria.preferred_location_ids'
                    render={({ field }) => (
                      <Autocomplete
                        fullWidth
                        multiple
                        loading={locationOptions.length === 0}
                        value={locationOptions?.filter(loc => field?.value?.includes(loc.id)) || []}
                        options={locationOptions || []}
                        groupBy={option => option?.state_name || ''}
                        getOptionKey={option => option.id}
                        getOptionLabel={(location) => location.city_name || ''}
                        onChange={(event, selectedOptions, reason, details) => {
                          const selectedIds = selectedOptions.map(opt => opt.id);

                          // Update the selected IDs in form
                          field.onChange(selectedIds);

                        }}

                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            label='Preferred Locations'
                            error={!!errors.source_criteria?.preferred_location_ids}
                            helperText={errors?.source_criteria?.preferred_location_ids?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth error={Boolean(errors?.source_criteria?.min_salary)}>
                    <FormLabel className='text-[var(--mui-palette-text-primary)] text-sm'>Annual Salary (in Lacs)</FormLabel>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }} className='flex' gap={2} alignItems='center'>
                        <Controller
                          control={control}
                          name='source_criteria.min_salary'
                          rules={{
                            validate: {
                              isValidSalary: (value) => {
                                if (!value) return true;
                                const sanitizedValue = value.replace(/,/g, '');

                                if (!/^\d+(\.\d{1,2})?$/.test(sanitizedValue)) {
                                  return 'Please enter a valid salary (numeric value, optionally with 2 decimal places)';
                                }

                                return true;
                              }
                            }
                          }}
                          render={({ field }) => (
                            <CustomTextField
                              fullWidth
                              error={!!errors?.source_criteria?.min_salary}
                              helperText={errors?.source_criteria?.min_salary?.message}
                              onInput={(e) => {
                                e.target.value = e.target.value
                                  .replace(/[^0-9.]/g, '')
                                  .replace(/^\./, '')
                                  .replace(/(\..*)\./g, '$1')
                                  .replace(/^(\d+)(\.\d{0,2})?.*$/, '$1$2');
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
                          name='source_criteria.max_salary'
                          rules={{
                            validate: {
                              isValidSalary: (value) => {
                                if (!value) return true;
                                const sanitizedValue = value.replace(/,/g, '');

                                if (!/^\d+(\.\d{1,2})?$/.test(sanitizedValue)) {
                                  return 'Please enter a valid salary (numeric value, optionally with 2 decimal places)';
                                }

                                return true;
                              }
                            }
                          }}
                          render={({ field }) => (
                            <CustomTextField
                              fullWidth
                              {...field}
                              error={!!errors?.source_criteria?.max_salary}
                              helperText={errors?.source_criteria?.max_salary?.message}
                              onInput={(e) => {
                                e.target.value = e.target.value
                                  .replace(/[^0-9.]/g, '')
                                  .replace(/^\./, '')
                                  .replace(/(\..*)\./g, '$1')
                                  .replace(/^(\d+)(\.\d{0,2})?.*$/, '$1$2');
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
                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' className='font-medium'>7. Increment Criteria (in %)</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    control={control}
                    name="source_criteria.min_increment"
                    rules={{
                      validate: {
                        isPositive: (value) => {
                          if (!value) return true;

                          if (isNaN(value) || Number(value) <= 0) {
                            return "Please enter a valid positive increment";
                          }

                          return true;
                        },
                        isLessThanMaxIncrement: (value) => {
                          if (!value) return true;
                          const maxIncrement = getValues("source_criteria.max_increment");

                          if (maxIncrement && !isNaN(maxIncrement) && Number(value) >= Number(maxIncrement)) {
                            return "Min increment must be less than Max increment";
                          }

                          return true;
                        }
                      }
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        label="Min. Increment"
                        error={!!errors?.source_criteria?.min_increment}
                        helperText={errors?.source_criteria?.min_increment?.message}
                        {...field}
                        inputMode="numeric"

                        // onInput={(e) => {
                        //   let val = e.target.value.replace(/[^0-9]/g, "").slice(0, 7);
                        //   e.target.value = val;
                        //   field.onChange(val);
                        // }}

                        onInput={(e) => {
                          let val = e.target.value.replace(/[^0-9]/g, '');

                          if (val !== '' && Number(val) > 100) val = '100';
                          e.target.value = val;
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    control={control}
                    name="source_criteria.max_increment"
                    rules={{
                      validate: {
                        isPositive: (value) => {
                          if (!value) return true;

                          if (isNaN(value) || Number(value) <= 0) {
                            return "Please enter a valid positive increment";
                          }

                          return true;
                        },
                        isGreaterThanMinIncrement: (value) => {
                          if (!value) return true;
                          const minIncrement = getValues("source_criteria.min_increment");

                          if (minIncrement && !isNaN(minIncrement) && Number(value) <= Number(minIncrement)) {
                            return "Max increment must be greater than Min increment";
                          }

                          return true;
                        }
                      }
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        label="Max. Increment"
                        error={!!errors?.source_criteria?.max_increment}
                        helperText={errors?.source_criteria?.max_increment?.message}
                        {...field}
                        inputMode="numeric"

                        // onInput={(e) => {
                        //   let val = e.target.value.replace(/[^0-9]/g, "").slice(0, 7);
                        //   e.target.value = val;
                        //   field.onChange(val);
                        // }}

                        onInput={(e) => {
                          let val = e.target.value.replace(/[^0-9]/g, '');

                          if (val !== '' && Number(val) > 100) val = '100';
                          e.target.value = val;
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControl error={Boolean(errors?.source_criteria?.same_for_search)}>
                    <Controller
                      name='source_criteria.same_for_search'
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Checkbox {...field} checked={field.value} onChange={e => {handleSameForSearch(e); field.onChange(e);}} />}
                          label='Source Criteria Same for Search Criteria'
                        />
                      )}
                    />
                    {errors?.source_criteria?.same_for_search && (
                      <FormHelperText error>{errors?.source_criteria?.same_for_search?.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value='search_criteria'>
              <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' className='font-medium'>
                    1. Experience
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth error={Boolean(errors?.minExp || errors?.minExp)}>
                    <FormLabel className='text-[var(--mui-palette-text-primary)] text-sm'>
                      Experience
                    </FormLabel>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }} className='flex' gap={2} alignItems='center'>
                        <Controller
                          control={control}
                          name='search_criteria.min_exp'
                          render={({ field }) => (
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
                                  error={!!errors?.search_criteria?.min_exp}
                                  helperText={errors?.search_criteria?.min_exp?.message}
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
                          name='search_criteria.max_exp'
                          render={({ field }) => (
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
                                  error={!!errors?.search_criteria?.max_exp}
                                  helperText={errors?.search_criteria?.max_exp?.message}
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
                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' className='font-medium'>
                    2. Preferred Industry
                  </Typography>
                </Grid>
                {/* <Grid size={{ xs: 12 }}>
                  <Controller
                    control={control}
                    name='source_criteria.preferred_industry_ids'
                    render={({ field }) => (
                      <Autocomplete
                        fullWidth
                        multiple
                        value={
                          industries && industries?.filter(ind => field?.value?.includes(ind.id)) || []
                        }
                        options={industries || []}
                        groupBy={option => option.category || ''}
                        getOptionKey={option => option.id}
                        getOptionLabel={(industry) => industry.name || ''}
                        onChange={(event, selectedOptions) => {
                          const selectedIds = selectedOptions.map(opt => opt.id);
                          const selectedNames = selectedOptions.map(opt => opt.name).join(', ');

                          field.onChange(selectedIds); // update the array of selected IDs

                          // Set the `preferred_industry` field with names
                          setValue('source_criteria.preferred_industry', selectedNames);
                        }}
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            label='Select Industry'
                            error={!!errors.source_criteria?.preferred_industry_ids}
                            helperText={errors?.source_criteria?.preferred_industry_ids?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <FormLabel className={`${errors?.source_criteria?.preferred_industry ?? 'text-[var(--mui-palette-text-primary)]'} text-sm`} error={errors?.preferred_industry}>Preferred Industry</FormLabel>
                    <Controller
                      control={control}
                      name='source_criteria.preferred_industry'
                      render={({ field }) => (
                        <div className={`border rounded-md ${errors?.source_criteria?.preferred_industry && 'border-error'}`}>
                          <EditorToolbar editor={preferredIndustryEditor} />
                          <Divider className={errors?.source_criteria?.preferred_industry && 'border-error'} />
                          <EditorContent {...field} editor={preferredIndustryEditor} className='overflow-y-auto p-3' />
                        </div>
                      )}
                    />
                    {errors?.source_criteria?.preferred_industry && <FormHelperText error>{errors?.source_criteria?.preferred_industry?.message}</FormHelperText>}
                  </FormControl>
                </Grid> */}
                <Grid size={{ xs: 12 }}>
                  <Controller
                    control={control}
                    name='search_criteria.preferred_industry_ids'
                    render={({ field }) => (
                      <Autocomplete
                        fullWidth
                        multiple
                        value={industries?.filter(ind => field?.value?.includes(ind.id)) || []}
                        options={industries || []}
                        groupBy={option => option.category || ''}
                        getOptionKey={option => option.id}
                        getOptionLabel={(industry) => industry.name || ''}
                        onChange={(event, selectedOptions, reason, details) => {
                          const selectedIds = selectedOptions.map(opt => opt.id);
                          const selectedNames = selectedOptions.map(opt => opt.name);

                          // Update the selected IDs in form
                          field.onChange(selectedIds);

                          if (!preferredIndustryEditor) return;

                          // When user adds an industry
                          if (reason === 'selectOption' && details?.option?.name) {
                            const newlyAdded = details.option.name;
                            const { from } = preferredIndustryEditor.state.selection;
                            const textBefore = preferredIndustryEditor.state.doc.textBetween(0, from, '\n');
                            const prefix = textBefore.trim().length > 0 ? ', ' : '';

                            preferredIndustryEditor
                              .chain()
                              .focus()
                              .insertContent(`${prefix}${newlyAdded}`)
                              .run();
                          }

                          // When user removes one
                          else if (reason === 'removeOption' && details?.option?.name) {
                            const removedName = details.option.name;

                            // Get the current editor content
                            const currentContent = preferredIndustryEditor.getText();

                            // Create a regex to safely remove that name (case insensitive, with optional comma/space)
                            const updatedText = currentContent
                              .replace(new RegExp(`\\b${removedName}\\b,?\\s*`, 'gi'), '')
                              .trim()
                              .replace(/(^,|,$)/g, '')
                              .trim();

                            // Replace editor content with updated text
                            preferredIndustryEditor.commands.setContent(updatedText);
                          }

                          // When user clears all
                          else if (reason === 'clear') {
                            preferredIndustryEditor.commands.clearContent();
                          }
                        }}

                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            label='Select Industry'
                            error={!!errors.search_criteria?.preferred_industry_ids}
                            helperText={errors?.search_criteria?.preferred_industry_ids?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' className='font-medium'>
                    3. Educational Qualification
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    control={control}
                    name='search_criteria.min_qualification'
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        select
                        required={false}
                        label={<>Minimum Qualification</>}
                        error={!!errors?.search_criteria?.min_qualification}
                        helperText={errors?.search_criteria?.min_qualification?.message}
                        {...field}
                      >
                        {qualificationData.map((qual) => (
                          <MenuItem key={qual.value} value={qual.value}>{qual.label}</MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' className='font-medium'>
                    4. Age Criteria
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    control={control}
                    name='search_criteria.min_age'
                    rules={{
                      validate: {
                        isPositive: (value) => {
                          if (!value) return true;

                          if (isNaN(value) || Number(value) <= 0) {
                            return 'Please enter a valid positive number';
                          }

                          return true;
                        },
                        isLessThanMaxAge: (value) => {
                          if (!value) return true;

                          const maxAge = getValues('search_criteria.max_age');

                          if (maxAge && !isNaN(maxAge) && Number(value) >= Number(maxAge)) {
                            return 'Min age must be less than Max age';
                          }

                          return true;
                        }
                      }
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        label={<>Min. Age</>}
                        error={!!errors?.search_criteria?.min_age}
                        helperText={errors?.search_criteria?.min_age?.message}
                        {...field}
                        onInput={(e) => {
                          let val = e.target.value.replace(/[^0-9]/g, '');

                          if (val !== '' && Number(val) > 100) val = '100';
                          e.target.value = val;
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    control={control}
                    name='search_criteria.max_age'
                    rules={{
                      validate: {
                        isPositive: (value) => {
                          if (!value) return true;

                          if (isNaN(value) || Number(value) <= 0) {
                            return 'Please enter a valid positive number';
                          }

                          return true;
                        },
                        isGreaterThanMinAge: (value) => {
                          if (!value) return true;

                          const minAge = getValues('search_criteria.min_age');

                          if (minAge && !isNaN(minAge) && Number(value) <= Number(minAge)) {
                            return 'Max age must be greater than Min age';
                          }

                          return true;
                        }
                      }
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        fullWidth
                        label={<>Max. Age</>}
                        error={!!errors?.search_criteria?.max_age}
                        helperText={errors?.search_criteria?.max_age?.message}
                        {...field}
                        onInput={(e) => {
                          let val = e.target.value.replace(/[^0-9]/g, '');

                          if (val !== '' && Number(val) > 100) val = '100';
                          e.target.value = val;
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' className='font-medium'>5. Key Skills - Keywords</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <SkillSearchOnly
                    control={control}
                    name='search_criteria.skill_ids'
                    errors={errors}
                    selectedSkills={selectedSearchSkills}
                    setSelectedSkills={setSelectedSearchSkills}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant='body2' className='font-medium'>6. Companies to source from</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <FormLabel className={`${errors?.search_criteria?.company_sources ?? 'text-[var(--mui-palette-text-primary)]'} text-sm`} error={!!errors?.search_criteria?.company_sources}>Company Sources</FormLabel>
                    <Controller
                      control={control}
                      name='search_criteria.company_sources'
                      render={({ field }) => (
                        <div className={`border rounded-md ${errors?.search_criteria?.company_sources && 'border-error'}`}>
                          <EditorToolbar editor={companySourcesEditor} />
                          <Divider className={errors?.search_criteria?.company_sources && 'border-error'} />
                          <EditorContent {...field} editor={companySourcesEditor} className='overflow-y-auto p-3' />
                        </div>
                      )}
                    />
                    {errors?.search_criteria?.company_sources && <FormHelperText error>{errors?.search_criteria?.company_sources?.message}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    control={control}
                    name='search_criteria.preferred_location_ids'
                    render={({ field }) => (
                      <Autocomplete
                        fullWidth
                        multiple
                        loading={locationOptions.length === 0}
                        value={locationOptions?.filter(loc => field?.value?.includes(loc.id)) || []}
                        options={locationOptions || []}
                        groupBy={option => option?.state_name || ''}
                        getOptionKey={option => option.id}
                        getOptionLabel={(location) => location.city_name || ''}
                        onChange={(event, selectedOptions, reason, details) => {
                          const selectedIds = selectedOptions.map(opt => opt.id);

                          // Update the selected IDs in form
                          field.onChange(selectedIds);

                        }}

                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            label='Preferred Locations'
                            error={!!errors.search_criteria?.preferred_location_ids}
                            helperText={errors?.search_criteria?.preferred_location_ids?.message}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth error={Boolean(errors?.search_criteria?.min_salary)}>
                    <FormLabel className='text-[var(--mui-palette-text-primary)] text-sm'>Annual Salary (in Lacs)</FormLabel>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }} className='flex' gap={2} alignItems='center'>
                        <Controller
                          control={control}
                          name='search_criteria.min_salary'
                          rules={{
                            validate: {
                              isValidSalary: (value) => {
                                if (!value) return true;
                                const sanitizedValue = value.replace(/,/g, '');

                                if (!/^\d+(\.\d{1,2})?$/.test(sanitizedValue)) {
                                  return 'Please enter a valid salary (numeric value, optionally with 2 decimal places)';
                                }

                                return true;
                              }
                            }
                          }}
                          render={({ field }) => (
                            <CustomTextField
                              fullWidth
                              error={!!errors?.search_criteria?.min_salary}
                              helperText={errors?.search_criteria?.min_salary?.message}
                              onInput={(e) => {
                                e.target.value = e.target.value
                                  .replace(/[^0-9.]/g, '')
                                  .replace(/^\./, '')
                                  .replace(/(\..*)\./g, '$1')
                                  .replace(/^(\d+)(\.\d{0,2})?.*$/, '$1$2');
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
                          name='search_criteria.max_salary'
                          rules={{
                            validate: {
                              isValidSalary: (value) => {
                                if (!value) return true;
                                const sanitizedValue = value.replace(/,/g, '');

                                if (!/^\d+(\.\d{1,2})?$/.test(sanitizedValue)) {
                                  return 'Please enter a valid salary (numeric value, optionally with 2 decimal places)';
                                }

                                return true;
                              }
                            }
                          }}
                          render={({ field }) => (
                            <CustomTextField
                              fullWidth
                              {...field}
                              error={!!errors?.search_criteria?.max_salary}
                              helperText={errors?.search_criteria?.max_salary?.message}
                              onInput={(e) => {
                                e.target.value = e.target.value
                                  .replace(/[^0-9.]/g, '')
                                  .replace(/^\./, '')
                                  .replace(/(\..*)\./g, '$1')
                                  .replace(/^(\d+)(\.\d{0,2})?.*$/, '$1$2');
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
            </TabPanel>


            {/* </CardContent> */}
          </TabContext>
        </AccordionDetails>
      </Accordion>


      {/* </Card> */}
      {/* <Accordion expanded={expanded === 'panel2'} onChange={handleExpandChange('panel2')}> */}

      {/* <TabPanel value='role_responsibility'> */}
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
      {/* </TabPanel> */}

      {/* <Accordion expanded={expanded === 'panel3'} onChange={handleExpandChange('panel3')}> */}
      {/* <TabPanel value='additional_details'> */}
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
            <Grid size={{ xs: 12, sm: 6 }}>
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
      {/* </TabPanel> */}
      {/* <TabPanel value='assign_branches'> */}
      <Accordion>
        <AccordionSummary expandIcon={<i className='tabler-chevron-right' />}>
          <Typography>Additional Benefits</Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails className='!pbs-6'>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
              <FormLabel className='text-[var(--mui-palette-text-primary)] text-sm'>Additional Benefits</FormLabel>
              <Controller
                name='additional_benefits'
                control={control}
                render={({ field }) => {
                  return (
                    <div className='border rounded-md'>
                      <EditorToolbar editor={additionalBenefitsEditor} />
                      <Divider />
                      <EditorContent {...field} editor={additionalBenefitsEditor} className='overflow-y-auto p-3' />
                    </div>
                  )
                }}
              />
            </FormControl>
              {/* <Controller
                control={control}
                name='additional_benefits'
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    multiline
                    maxRows={6}
                    label='Additional Benefits'
                    error={!!errors?.additional_benefits} helperText={errors?.additional_benefits?.message}
                    {...field}
                  />
                )}
              /> */}
            </Grid>
          </Grid>
        </AccordionDetails>
        <Divider />
        <AccordionDetails className='flex gap-4 pbs-6'>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<i className='tabler-chevron-right' />}>
          <Typography>Assign to Branches</Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails className='!pbs-6'>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                control={control}
                name='selectedBranchIds'
                render={({ field }) => (
                  <Autocomplete
                    fullWidth
                    multiple
                    disableCloseOnSelect
                    options={branchData || []}
                    value={branchData?.filter(option => field.value?.includes(option.id)) || []}
                    getOptionLabel={(option) => option?.business_name || ''}
                    onChange={(event, newValue) => {
                      field.onChange(newValue.map(option => option?.id));
                    }}
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const tagProps = getTagProps({ index });
                        const { key, ...rest } = tagProps;

                        return <Chip label={option?.business_name} key={key} {...rest} />;
                      })
                    }
                    renderOption={(props, option, { selected }) => {
                      const { key, ...rest } = props;

                      return (
                        <li key={key} {...rest}>
                          <Checkbox
                            size="small"
                            checked={selected}

                            // onClick={(e) => e.stopPropagation()}
                            style={{ marginRight: 8 }}
                          />
                          {option?.business_name} {option?.assignedJobs?.job_title}
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        error={!!errors?.selectedBranchIds}
                        helperText={errors?.selectedBranchIds?.message}
                        label='Select Branches'
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
        <Divider />
        <AccordionDetails className='flex gap-4 pbs-6'>
        </AccordionDetails>
      </Accordion>
      {/* </TabPanel> */}
      {/* <Divider />
      <CardActions>
      </CardActions> */}
      <Button type='submit' variant='contained'>
        Submit
      </Button>
      <Button type='reset' variant='tonal' color='secondary' onClick={() => reset()}>
        Reset
      </Button>
    </form >
  )
}

export default FormAddEditJob
