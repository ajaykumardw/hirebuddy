'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

import { toast } from 'react-toastify'

import { useSession } from 'next-auth/react'

// Component Imports
import TableFilters from './TableFilters'

// import AddUserDrawer from './AddUserDrawer'

import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

import { formatToLacOrCr } from '@/utils/formatCTC'

import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import { monthsOpt, yearsOpt } from '@/configs/customDataConfig'

import CandidateInfo from '@/components/CandidateInfo'

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Vars
const userRoleObj = {
  admin: { icon: 'tabler-crown', color: 'error' },
  author: { icon: 'tabler-device-desktop', color: 'warning' },
  editor: { icon: 'tabler-edit', color: 'info' },
  maintainer: { icon: 'tabler-chart-pie', color: 'success' },
  subscriber: { icon: 'tabler-user', color: 'primary' }
}

const userStatusObj = {
  1: 'success',

  // pending: 'warning',

  0: 'secondary'
}

// Column Definitions
const columnHelper = createColumnHelper()

const CandidatesListTable = ({ tableData }) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[tableData])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const { lang: locale } = useParams();
  const { data: session } = useSession();
  const user = session?.user;
  const token = user?.token;

  useEffect(() => {
    // Ensure DOM is painted before showing toasts
    const runAfterMount = () => {
      const success = sessionStorage.getItem('success');
      const error = sessionStorage.getItem('error');

      if (success) {
        toast.success(success, {
          autoClose: 10000,
          hideProgressBar: false,
        });
        sessionStorage.removeItem('success');
      }

      if (error) {
        toast.error(error, {
          autoClose: 10000,
          hideProgressBar: false,
        });
        sessionStorage.removeItem('error');
      }
    };

    // Run after paint
    requestAnimationFrame(() => {
      setTimeout(runAfterMount, 0);
    });
  }, []);

  // const formatToLacOrCr = (number) => {
  //   // Check if the number is greater than or equal to 1 Crore
  //   if (number >= 10000000) {
  //     // Convert to Crore (divide by 10,000,000)
  //     const valueInCrore = number / 10000000;

  //     // Format the value using `Intl.NumberFormat`
  //     const formattedValue = new Intl.NumberFormat("en-IN", {
  //       maximumFractionDigits: 2, // Limit to 2 decimal places
  //     }).format(valueInCrore);

  //     return `${formattedValue} Cr`; // Append "Cr" for Crore
  //   } else if (number >= 100000) {
  //     // Convert to Lakh (divide by 100,000)
  //     const valueInLakh = number / 100000;

  //     // Format the value using `Intl.NumberFormat`
  //     const formattedValue = new Intl.NumberFormat("en-IN", {
  //       maximumFractionDigits: 2, // Limit to 2 decimal places
  //     }).format(valueInLakh);

  //     return `${formattedValue} Lac`; // Append "Lac" for Lakh
  //   } else {
  //     // For values less than 1 Lakh, simply return the number formatted with commas
  //     return new Intl.NumberFormat("en-IN").format(number);
  //   }
  // };

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            {/* <IconButton onClick={() => setData(data?.filter(product => product.id !== row.original?.id))}>
              <i className='tabler-trash text-textSecondary' />
            </IconButton> */}
            <IconButton>
              <Link target='blank' href={getLocalizedUrl(`/candidates/${row.original.id}/view`, locale)} className='flex'>
                <i className='tabler-eye text-textSecondary' />
              </Link>
            </IconButton>
            <IconButton>
              <Link href={getLocalizedUrl(`/candidates/${row.original.id}/edit`, locale)} className='flex'>
                <i className='tabler-edit text-textSecondary' />
              </Link>
            </IconButton>
            {/* <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                {
                  text: 'Download',
                  icon: 'tabler-download',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                },
                {
                  text: 'Edit',
                  icon: 'tabler-edit',
                  menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
                }
              ]}
            /> */}
          </div>
        ),
        enableSorting: false
      }),
      columnHelper.accessor('full_name', {
        header: 'Candidate',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {getAvatar({ avatar: row.original?.profile_image, fullName: row.original?.full_name })}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original?.full_name}
                {row.original?.status_info?.length > 0 && (
                  <CandidateInfo info={row.original?.status_info?.[0]} />
                )}
              </Typography>
              <Typography variant='body2'>{row.original?.profile_title}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original?.email}
          </Typography>
        )
      }),
      columnHelper.accessor('mobile_no', {
        header: 'Mobile No.',
        cell: ({ row }) => <Typography>{row.original?.mobile_no}</Typography>
      }),
      columnHelper.accessor('date_of_birth', {
        header: 'Date of Birth',
        cell: ({ row }) => <Typography>{row.original?.date_of_birth ? new Date(row.original?.date_of_birth).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }) : ''}</Typography>
      }),
      columnHelper.accessor('work_status', {
        header: 'Work Status',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original?.work_status == 'experienced' ? 'Experienced' : 'Fresher'}
            size='small'
            color={row.original?.work_status == 'experienced' ? 'success' : 'error'}
            className='capitalize'
          />

          // <Typography className='capitalize' color='text.primary'>
          //   {row.original?.work_status}
          // </Typography>

        )
      }),
      columnHelper.accessor('industry', {
        header: 'Industry Type',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original?.industry?.name}
          </Typography>
        )
      }),
      columnHelper.accessor('department', {
        header: 'Department',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original?.department?.name}
          </Typography>
        )
      }),
      columnHelper.accessor('skill', {
        header: 'Skills',
        cell: ({ row }) => (
          <div className='capitalize flex flex-wrap gap-2'>
            {row.original?.skills?.map(s => (
              <Chip
                key={s.id}
                variant='tonal'
                label={s.name}
                size='small'
                color='info'
                className='capitalize'
              />
            ))}
          </div>
        )
      }),
      columnHelper.accessor('city.city_name', {
        header: 'Current City',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original?.city?.city_name}
          </Typography>
        )
      }),
      columnHelper.accessor('total_experience', {
        header: 'Total Experience',
        cell: ({ row }) => {
          const [years, months] = row.original?.total_experience ? row.original?.total_experience.split('.') : ['0', '0'];
          const yearsLabel = yearsOpt.find(opt => opt.value === years)?.label || ''
          const monthsLabel = monthsOpt.find(opt => opt.value === months)?.label || ''

          return (
            <Typography className='capitalize' color='text.primary'>
              {row.original?.total_experience ? yearsLabel + ' ' + monthsLabel : ''}
            </Typography>
          )
        }
      }),
      columnHelper.accessor('current_ctc', {
        header: 'Current CTC',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original?.current_ctc ? formatToLacOrCr(row.original?.current_ctc) : ''}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Chip
              variant='tonal'
              label={row.original?.status == 1 ? 'Active' : 'Inactive'}
              size='small'
              color={userStatusObj[row.original?.status]}
              className='capitalize'
            />
          </div>
        )
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original?.age? > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const getAvatar = params => {
    const { avatar, fullName } = params

    if (avatar) {
      return <CustomAvatar src={avatar} size={34} />
    } else {
      return <CustomAvatar size={34}>{getInitials(fullName)}</CustomAvatar>
    }
  }

  const handleAutoImport = async() => {
    if(!token) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parse-bulk-cv`, {
      method: 'post',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    const result = await res.json();

    if(res.ok){

      toast.success(result?.message, {
        autoClose: 10000,
        hideProgressBar: false,
      });
    } else {
      toast.error(result?.message || 'Something went wrong', {
        autoClose: 10000,
        hideProgressBar: false,
      });
    }

  }

  return (
    <>
      <Card>
        <CardHeader title='Filters' className='pbe-4' />
        <TableFilters setData={setFilteredData} tableData={data} />
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='max-sm:is-full sm:is-[70px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search Candidate'
              className='max-sm:is-full'
            />
            {user?.id == 10 &&
              <Button
                color='info'
                variant='tonal'
                startIcon={<i className='tabler-download' />}
                className='max-sm:is-full'
                onClick={handleAutoImport}
              >
                Auto Import
              </Button>
            }
              {/* <Button
                color='secondary'
                variant='tonal'
                startIcon={<i className='tabler-upload' />}
                className='max-sm:is-full'
              >
                Export
              </Button> */}
            <Link href={getLocalizedUrl('/candidates/add', locale)}>
              <Button
                variant='contained'
                startIcon={<i className='tabler-plus' />}
                className='max-sm:is-full'
              >
                Add Candidate
              </Button>
            </Link>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='tabler-chevron-up text-xl' />,
                              desc: <i className='tabler-chevron-down text-xl' />
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>
      {/* <AddUserDrawer
        open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        userData={data}
        setData={setData}
      /> */}
    </>
  )
}

export default CandidatesListTable
