'use client'

// React Imports
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

import { Controller, useForm } from 'react-hook-form'

import { Autocomplete, CircularProgress, FormControl, FormControlLabel, FormHelperText, FormLabel, Menu, Radio, RadioGroup, Select, TextField } from '@mui/material'

import { useSession } from 'next-auth/react'

// Components Imports
import CustomTextField from '@core/components/mui/TextField'

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'


// import { getCookie } from '@/utils/cookies'

import { MenuProps } from '@/configs/customDataConfig'

// import { debounce } from 'lodash'


// import { toast } from 'react-toastify'


const defaultValues = {
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    loginValidUpto: null,
    status: '1',
    firstName: '',
    lastName: '',
    mobileNumber: '',
    employeeCode: '',
    dateOfBirth: null,
    dateOfJoining: null,
    reportingManager: '',
    department: '',
    designation: '',
    state: '',
    city: '',
    address: '',
    pincode: '',
    alternateEmail: '',
    alternatePhone: '',
    reportingManager: '',
    note: '',
    profileImage: ''
}

const FormUserAdd = ({ statesData, designations, reportingManagers, userData }) => {
    // States
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        isPasswordShown: false,
        confirmPassword: '',
        isConfirmPasswordShown: false,
        firstName: '',
        lastName: '',
        country: '',
        pfNo: '',
        branch: '',
        division: '',
        designation: '',
        station: '',
        checkingAuthority: '',
        taSrNo: '',
        incentiveAmt: '',
        incentivePercentage: '',
        payBand: '',
        gPay: '',
        firstClassDutyPassNo: '',
        fatherName: '',
        language: [],
        date: null,
        phoneNumber: ''
    })

    // const [data, setData] = useState();

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(false);

    const [fileInput, setFileInput] = useState('')
    const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')

    const router = useRouter();
    const { data: session } = useSession();
    const token = session?.user?.token;

    useEffect(() => {

    }, [userData])



    // useEffect(() => {

    //   const fetchData = async () => {
    //     const token = await getCookie('token');

    //     try {
    //       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/user/add`, {
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'Authorization': `Bearer ${token.value}`
    //         }
    //       });

    //       const jsonData = await response.json();

    //       // if(response.status === 401) {
    //       //   router.push('/not-authorized');
    //       // }

    //       setData(jsonData);
    //     } catch (error) {
    //       console.error('Error fetching data:', error);
    //       setData(null);
    //     }
    //   };

    //   fetchData();

    // }, []);

    const handleClickShowPassword = () => setFormData(show => ({ ...show, isPasswordShown: !show.isPasswordShown }))

    const handleClickShowConfirmPassword = () =>
        setFormData(show => ({ ...show, isConfirmPasswordShown: !show.isConfirmPasswordShown }))

    const handleReset = () => {
        setFormData({
            username: '',
            email: '',
            password: '',
            isPasswordShown: false,
            confirmPassword: '',
            isConfirmPasswordShown: false,
            firstName: '',
            lastName: '',
            country: '',
            pfNo: '',
            gender: '',
            branch: '',
            division: '',
            designation: '',
            station: '',
            checkingAuthority: '',
            taSrNo: '',
            incentiveAmt: '',
            incentivePercentage: '',
            payBand: '',
            gPay: '',
            firstClassDutyPassNo: '',
            fatherName: '',
            language: [],
            dateOfBirth: null,
            dateOfJoining: null,
            loginValidUpto: null,
            phoneNumber: ''
        })
    }

    const {
        control,
        handleSubmit,
        reset,
        setError,
        watch,
        formState: { errors }
    } = useForm({ defaultValues })

    const onSubmit = async (data) => {

        // console.log('form data', data);

        const formData = new FormData();

        // Append each field manually
        for (const key in data) {
            if (data[key] !== undefined && data[key] !== null) {
                if (key === 'loginValidUpto' || key === 'dateOfBirth' || key === 'dateOfJoining') {
                    formData.append(key, data[key].toISOString());
                } else {
                    formData.append(key, data[key]);
                }
            }
        }

        // const token = await getCookie('token');

        if (token) {

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/users/store`, {
                method: 'post',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await res.json();

            if (res.ok) {

                sessionStorage.setItem('success', result.message);

                router.push('/branch/user/list');

                reset();


            } else if (res.status == 422) {

                // Laravel returns validation errors in the `errors` object
                Object.entries(result.errors).forEach(([field, messages]) => {
                    setError(field, {
                        type: 'manual',
                        message: messages[0], // Use the first error message for each field
                    });
                });

            } else {
                sessionStorage.setItem('error', result.message);

                router.push('/branch/user/list');

            }
        }
    }

    const password = watch('password')

    // const {data: session} = useSession();
    // const token = session?.user?.token;

    // console.log('tokenada', token);

    // const fetchStates = useCallback(async (query) => {
    //   if(!token) return;

    //   console.log('query', query, query === undefined);

    //   setLoading(true);
    //   try {
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/states?search=${query !== undefined ? query : ''}`, {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${token}`
    //       }
    //     });
    //     const data = await response.json();
    //     setStates(data.states || []);
    //   } catch (error) {
    //     console.error('Failed to fetch states:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // }, [token]);

    // useEffect(() => {

    //   if(token){
    //     fetchStates();
    //   }

    // }, [token]);

    // const debouncedFetch = useMemo(() => debounce(fetchStates, 300), []);


    const handleFileChange = (onChange) => (e) => {
        const file = e.target.files?.[0];

        if (file) {
            const fileReader = new FileReader();

            fileReader.onload = () => {
                setImgSrc(fileReader.result);
                onChange(file); // store the actual file in form state
            };

            fileReader.readAsDataURL(file);
        }
    };

    const handleFileInputReset = () => {
        setFileInput('')
        setImgSrc('/images/avatars/1.png')
    }

    const selectedState = watch('state');
    const selectedDepartment = watch('department');

    return (
        <Card>
            <CardHeader title='Add User' />
            <Divider />
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent>
                    <Grid container spacing={6}>

                        {/* ==================== 1. Account Details ==================== */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="body2" className="font-medium">1. Account Details</Typography>
                        </Grid>

                        {/* Username */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="username" control={control}
                                rules={{
                                    required: 'This field is required.',
                                    pattern: {
                                        value: /^[a-zA-Z0-9]+$/, // Only letters and numbers, no space or symbols
                                        message: 'Username must be alphanumeric and contain no spaces.'
                                    }
                                }}
                                render={({ field }) => (
                                    <CustomTextField fullWidth label={<>Login ID <span className='text-error'>*</span></>}
                                        required={false}
                                        error={!!errors.username} helperText={errors.username?.message} {...field} />
                                )} />
                        </Grid>

                        {/* Email */}
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

                        {/* Password */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="password" control={control}
                                rules={{ required: 'This field is required.' }}
                                render={({ field }) => (
                                    <CustomTextField fullWidth label={<>Password <span className='text-error'>*</span></>} required={false} placeholder="••••••••"
                                        type={showPassword ? 'text' : 'password'}
                                        error={!!errors.password} helperText={errors.password?.message}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(p => !p)}>
                                                        <i className={showPassword ? 'tabler-eye-off' : 'tabler-eye'} />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        {...field} />
                                )} />
                        </Grid>

                        {/* Confirm Password */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="password_confirmation" control={control}
                                rules={{
                                    required: 'This field is required.',
                                    validate: value => value === password || 'Passwords do not match'
                                }}
                                render={({ field }) => (
                                    <CustomTextField fullWidth label={<>Confirm Password <span className='text-error'>*</span></>} placeholder="••••••••"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        error={!!errors.password_confirmation} helperText={errors.password_confirmation?.message}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowConfirmPassword(p => !p)}>
                                                        <i className={showConfirmPassword ? 'tabler-eye-off' : 'tabler-eye'} />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        {...field} />
                                )} />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="loginValidUpto" control={control}
                                rules={{ required: 'This field is required.' }}
                                render={({ field }) => (
                                    <AppReactDatepicker
                                        selected={field.value} onChange={field.onChange}
                                        showYearDropdown showMonthDropdown dateFormat="yyyy/MM/dd"
                                        placeholderText="YYYY/MM/DD"
                                        customInput={
                                            <CustomTextField fullWidth label={<>Login Valid Upto  <span className='text-error'>*</span></>}
                                                error={!!errors.loginValidUpto} helperText={errors?.loginValidUpto?.message} />
                                        }
                                    />
                                )} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="status" control={control}
                                rules={{ required: 'This field is required.' }}
                                render={({ field }) => (
                                    <CustomTextField select fullWidth label={<>Status <span className='text-error'>*</span></>}
                                        SelectProps={{ MenuProps }}
                                        error={!!errors.status} helperText={errors?.status?.message} {...field}>
                                        <MenuItem value="1">Active</MenuItem>
                                        <MenuItem value="0">Inactive</MenuItem>
                                    </CustomTextField>
                                )} />
                        </Grid>

                        {/* <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl error={!!errors.accountType}>
                            <FormLabel><>Account Type <span className='text-error'>*</span></></FormLabel>
                            <Controller name="accountType" control={control}
                            rules={{ required: 'This field is required.' }}
                            render={({ field }) => (
                                <RadioGroup row {...field}>
                                <FormControlLabel value="Recruiter" control={<Radio />} label="Recruiter" />
                                <FormControlLabel value="Mobilizer" control={<Radio />} label="Mobilizer" />
                                <FormControlLabel value="Both" control={<Radio />} label="Both" />
                                </RadioGroup>
                            )} />
                            {errors.accountType && <FormHelperText error>{errors.accountType.message}</FormHelperText>}
                        </FormControl>
                        </Grid> */}

                        {/* ==================== 2. Personal Info ==================== */}
                        <Grid size={{ xs: 12 }}><Divider /></Grid>
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="body2" className="font-medium">2. User Info</Typography>
                        </Grid>
                        

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="reportingManager" control={control}
                                rules={{ required: 'This field is required.' }}
                                render={({ field }) => (
                                    <Autocomplete
                                        fullWidth

                                        // {...field}

                                        value={reportingManagers && reportingManagers.find(reporting => reporting.id === field.value) || null}
                                        options={reportingManagers || []}
                                        getOptionKey={option => option.id}
                                        getOptionLabel={(reporting) => reporting.first_name + " " + reporting.last_name  || ''}
                                        onChange={(event, value) => {
                                            field.onChange(value?.id || '')
                                        }}
                                        renderInput={(params) => (
                                            <CustomTextField
                                                {...params}
                                                label={<>Reporting Manager <span className='text-error'>*</span></>}
                                                error={!!errors.reportingManager}
                                                helperText={errors?.reportingManager?.message}
                                            />
                                        )}
                                    />

                                    // <CustomTextField select fullWidth label={<>Reporting Manager <span className='text-error'>*</span></>}
                                    //     SelectProps={{ MenuProps }}
                                    //     error={!!errors.reportingManager} helperText={errors?.reportingManager?.message} {...field}>
                                    //         {reportingManagers && reportingManagers.length > 0 reportingManagers.map}
                                    //     <MenuItem value="">Select Size</MenuItem>
                                    //     <MenuItem value="0-10">0-10</MenuItem>
                                    //     <MenuItem value="10-50">10-50</MenuItem>
                                    //     <MenuItem value="50-100">50-100</MenuItem>
                                    //     <MenuItem value="100+">100+</MenuItem>
                                    // </CustomTextField>

                                )} />
                        </Grid>

                        {/* First & Last Name */}
                        {[
                            ['firstName', 'First Name', true],
                            ['lastName', 'Last Name'],
                            ['mobileNumber', 'Mobile No.', true, 'number'],

                            //   ['websiteUrl', 'Website URL'],

                        ].map(([name, label, required = false, type = "text"]) => (
                            <Grid size={{ xs: 12, sm: 6 }} key={name}>
                                <Controller name={name} control={control}
                                    rules={{ required: required && 'This field is required.' }}
                                    render={({ field }) => (
                                        <CustomTextField fullWidth label={<>{label} {required && <span className='text-error'>*</span>}</>} type={type}
                                            error={!!errors[name]} helperText={errors[name]?.message} {...field} />
                                    )} />
                            </Grid>
                        ))}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="dateOfBirth" control={control}
                                rules={{ required: 'This field is required.' }}
                                render={({ field }) => (
                                    <AppReactDatepicker
                                        selected={field.value} onChange={field.onChange}
                                        showYearDropdown showMonthDropdown dateFormat="yyyy/MM/dd"
                                        placeholderText="YYYY/MM/DD"
                                        customInput={
                                            <CustomTextField fullWidth label={<>Date of Birth  <span className='text-error'>*</span></>}
                                                error={!!errors.dateOfBirth} helperText={errors?.dateOfBirth?.message} />
                                        }
                                    />
                                )} />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="employeeCode" control={control}
                                rules={{
                                    required: 'This field is required.',
                                    pattern: {
                                        value: /^[a-zA-Z0-9]+$/, // Only letters and numbers, no space or symbols
                                        message: 'Employee Code must be alphanumeric and contain no spaces.'
                                    }
                                }}
                                render={({ field }) => (
                                    <CustomTextField fullWidth label={<>Employee Code <span className='text-error'>*</span></>}
                                        required={false}
                                        error={!!errors.employeeCode} helperText={errors.employeeCode?.message} {...field}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="dateOfJoining" control={control}
                                rules={{ required: 'This field is required.' }}
                                render={({ field }) => (
                                    <AppReactDatepicker
                                        selected={field.value} onChange={field.onChange}
                                        showYearDropdown showMonthDropdown dateFormat="yyyy/MM/dd"
                                        placeholderText="YYYY/MM/DD"
                                        customInput={
                                            <CustomTextField fullWidth label={<>Date of Joining <span className='text-error'>*</span></>}
                                                error={!!errors.dateOfJoining} helperText={errors?.dateOfJoining?.message} />
                                        }
                                    />
                                )} />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="alternateEmail" control={control}
                                rules={{
                                    pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Invalid email' }
                                }}
                                render={({ field }) => (
                                    <CustomTextField fullWidth required={false} label='Alternate Email' type="email"
                                        error={!!errors.alternateEmail} helperText={errors.alternateEmail?.message} {...field} />
                                )} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="alternatePhone" control={control}
                                render={({ field }) => (
                                    <CustomTextField fullWidth required={false} label='Alternate Phone' type="number"
                                        error={!!errors.alternatePhone} helperText={errors.alternatePhone?.message} {...field} />
                                )} />
                        </Grid>
                        {/* <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="department" control={control}
                                rules={{ required: 'This field is required.' }}
                                render={({ field }) => (
                                    <Autocomplete
                                        fullWidth

                                        // {...field}

                                        value={departments && departments.find(department => department.id === field.value) || null}
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
                        </Grid> */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="designation" control={control}
                                rules={{ required: 'This field is required.' }}
                                render={({ field }) => (
                                    <Autocomplete
                                        fullWidth
                                        options={designations && designations || []}
                                        getOptionLabel={(designation) => designation.name || ''}
                                        getOptionKey={option => option.id}
                                        value={designations && designations.find((d) => d.id === field.value) || null}
                                        onChange={(event, value) => field.onChange(value?.id || '')}
                                        renderInput={(params) => (
                                            <CustomTextField
                                                {...params}
                                                label={<>Designation <span className='text-error'>*</span></>}
                                                error={!!errors.designation}
                                                helperText={errors?.designation?.message}
                                            />
                                        )}
                                    />
                                )} />
                        </Grid>
                        <Grid size={{ xs: 12 }}><Divider /></Grid>
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="body2" className="font-medium">3. Address Info</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="state" control={control}
                                rules={{ required: 'This field is required.' }}
                                render={({ field }) => (
                                    <Autocomplete
                                        fullWidth

                                        // {...field}

                                        value={statesData && statesData.find(state => state.id === field.value) || null}
                                        options={statesData || []}
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
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="city" control={control}
                                rules={{ required: 'This field is required.' }}
                                render={({ field }) => (
                                    <Autocomplete
                                        fullWidth
                                        options={statesData && statesData.find(state => state.id === selectedState)?.cities || []}
                                        getOptionLabel={(city) => city.city_name || ''}
                                        value={statesData && statesData.find(state => state.id === selectedState)?.cities.find((c) => c.id === field.value) || null}
                                        onChange={(event, value) => field.onChange(value?.id || '')}
                                        renderInput={(params) => (
                                            <CustomTextField
                                                {...params}
                                                label={<>City <span className='text-error'>*</span></>}
                                                error={!!errors.city}
                                                helperText={errors?.city?.message}
                                            />
                                        )}
                                    />
                                )} />
                        </Grid>

                        {[
                            ['address', 'Address', true],
                            ['pincode', 'Pincode', false, 'number'],

                            // ['experience', 'Years in Business', false, 'number'],
                            // ['industrySpecializedIn', 'Industries Specialized In'],

                        ].map(([name, label, required = false, type = "text"]) => (
                            <Grid size={{ xs: 12, sm: 6 }} key={name}>
                                <Controller name={name} control={control}
                                    rules={{ required: required && 'This field is required.' }}
                                    render={({ field }) => (
                                        <CustomTextField fullWidth label={<>{label} {required && <span className='text-error'>*</span>}</>} type={type}
                                            error={!!errors[name]} helperText={errors[name]?.message} {...field} />
                                    )} />
                            </Grid>
                        ))}

                        {/* <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="contractOrNDAfile"
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        fullWidth
                                        type="file"
                                        accept="
                                            image/jpeg,
                                            image/png,
                                            application/pdf,
                                            application/msword,
                                            application/vnd.openxmlformats-officedocument.wordprocessingml.document
                                        "
                                        label="Upload Contract or NDA (If applicable)"
                                        error={!!errors.contractOrNDAfile}
                                        helperText={errors.contractOrNDAfile?.message}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            field.onChange(file);     // updates the RHF form state
                                        }}
                                        inputProps={{ multiple: false }}
                                    />
                                )}
                            />
                        </Grid> */}

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller name="note" control={control}
                                render={({ field }) => (
                                    <CustomTextField fullWidth multiline minRows={2} maxRows={4} label='Notes'
                                        error={!!errors.note} helperText={errors.note?.message} {...field} />
                                )} />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <div className='flex max-sm:flex-col items-center gap-6'>
                                <img height={100} width={100} className='rounded' src={imgSrc} alt='Profile' />
                                <div className='flex flex-grow flex-col gap-4'>
                                    <div className='flex flex-col sm:flex-row gap-4'>
                                        <Controller
                                            name='profileImage'
                                            control={control}
                                            render={({ field: { onChange, ref }, fieldState: { error } }) => (
                                                <>
                                                    <Button component='label' variant='contained'>
                                                        Upload New Photo
                                                        <input
                                                            hidden
                                                            type='file'
                                                            accept='image/png, image/jpeg'
                                                            onChange={handleFileChange(onChange)}
                                                            ref={ref}
                                                        />
                                                    </Button>
                                                    <Button variant='tonal' color='secondary' onClick={handleFileInputReset}>
                                                        Reset
                                                    </Button>
                                                </>
                                            )}
                                            rules={{
                                                required: 'This field is required',
                                                validate: (file) =>
                                                    !file || file.size < 800 * 1024 || 'Max file size is 800KB',
                                            }}
                                        />
                                    </div>
                                    <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>

                                    {errors.profileImage && (
                                        <FormHelperText error>{errors.profileImage.message}</FormHelperText>
                                    )}
                                </div>
                            </div>
                        </Grid>


                        {/* Date of Birth */}
                        {/* <Grid size={{ xs: 12, sm: 6 }}>
              <Controller name="dateOfBirth" control={control}
                rules={{ required: 'This field is required.' }}
                render={({ field }) => (
                  <AppReactDatepicker
                    selected={field.value} onChange={field.onChange}
                    showYearDropdown showMonthDropdown dateFormat="yyyy/MM/dd"
                    placeholderText="YYYY/MM/DD"
                    customInput={
                      <CustomTextField fullWidth label={<>{`Date of Birth`} {<span className='text-error'>*</span> }</>}
                        error={!!errors.dateOfBirth} helperText={errors.dateOfBirth?.message} />
                    }
                  />
                )} />
            </Grid> */}

                        {/* Gender */}
                        {/* <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl error={!!errors.gender}>
                <FormLabel>Gender</FormLabel>
                <Controller name="gender" control={control}
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel value="m" control={<Radio />} label="Male" />
                      <FormControlLabel value="f" control={<Radio />} label="Female" />
                    </RadioGroup>
                  )} />
              </FormControl>
            </Grid> */}

                        {/* Father Name & PF No */}
                        {/* {[
              ['fatherName', 'Father Name'],
              ['pfNo', 'PF No.']
            ].map(([name, label]) => (
              <Grid size={{ xs: 12, sm: 6 }} key={name}>
                <Controller name={name} control={control}
                  render={({ field }) => (
                    <CustomTextField fullWidth label={label}
                      error={!!errors[name]} helperText={errors[name]?.message} {...field} />
                  )} />
              </Grid>
            ))} */}

                        {/* ==================== 3. Employment Info ==================== */}
                        {/* <Grid size={{ xs: 12 }}><Divider /></Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" className="font-medium">3. Employment Info</Typography>
            </Grid> */}

                        {/* Date of Joining + Login Valid */}
                        {/* {[
              ['dateOfJoining', 'Date of Joining', true],
              ['loginValidUpto', 'Login Valid Up To', true]
            ].map(([name, label, required = false]) => (
              <Grid size={{ xs: 12, sm: 6 }} key={name}>
                <Controller name={name} control={control}
                  rules={{ required: 'This field is required.' }}
                  render={({ field }) => (
                    <AppReactDatepicker
                      selected={field.value} onChange={field.onChange}
                      showYearDropdown showMonthDropdown dateFormat="yyyy/MM/dd"
                      placeholderText="YYYY/MM/DD"
                      customInput={
                        <CustomTextField fullWidth label={<>{ label } {required && <span className='text-error'>*</span> }</>}
                          error={!!errors[name]} helperText={errors[name]?.message} />
                      }
                    />
                  )} />
              </Grid>
            ))} */}

                        {/* Branch / Division / Designation / Station */}
                        {/* {[
              ['branch', 'Branch', data?.branches, 'branch_name', true],
              ['division', 'Division', data?.divisions, 'division_name', true],
              ['designation', 'Designation', data?.designations, 'designation_name', true],
              ['station', 'Choose Station Head Quarter', data?.stations, 'station_name', true]
            ].map(([name, label, options, key, required = false]) => (
              <Grid size={{ xs: 12, sm: 6 }} key={name}>
                <Controller name={name} control={control}
                  rules={{ required: 'This field is required.' }}
                  render={({ field }) => (
                    <CustomTextField select fullWidth label={<>{ label } {required && <span className='text-error'>*</span> }</>}
                      SelectProps={{ MenuProps }}
                      error={!!errors[name]} helperText={errors[name]?.message} {...field}>
                      {options?.length > 0
                        ? options.map((o, i) => <MenuItem key={i} value={o.id}>{o[key]}</MenuItem>)
                        : <MenuItem value="">No Data</MenuItem>}
                    </CustomTextField>
                  )} />
              </Grid>
            ))} */}

                        {/* ==================== 4. Contact Info ==================== */}
                        {/* <Grid size={{ xs: 12 }}><Divider /></Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" className="font-medium">4. Contact Info</Typography>
            </Grid> */}

                        {/* Phone + Checking Authority */}
                        {/* {[
              ['phoneNumber', 'Mobile No.', 'number', true],
              ['checkingAuthority', 'Checking Authority No']
            ].map(([name, label, type = 'text', required = false]) => (
              <Grid size={{ xs: 12, sm: 6 }} key={name}>
                <Controller name={name} control={control}
                  rules={{required: required && 'This field is required.'}}
                  render={({ field }) => (
                    <CustomTextField fullWidth label={<>{label} {required && <span className='text-error'>*</span> }</>} type={type}
                      error={!!errors[name]} helperText={errors[name]?.message} {...field} />
                  )} />
              </Grid>
            ))} */}


                    </Grid>
                </CardContent>

                <Divider />

                <CardActions>
                    <Button type="submit" variant="contained">Submit</Button>
                    <Button type="button" variant="tonal" color="secondary" onClick={() => reset()}>
                        Reset
                    </Button>
                </CardActions>
            </form>
        </Card>
    )
}

export default FormUserAdd
