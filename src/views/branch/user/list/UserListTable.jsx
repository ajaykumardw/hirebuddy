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

// Component Imports
import TableFilters from './TableFilters'
import AddUserDrawer from './AddUserDrawer'
import OptionMenu from '@core/components/option-menu'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import ChangePasswordDialog from '@/components/ChangePasswordDialog'

// import { getCookie } from '@/utils/cookies'
// import { useSession } from 'next-auth/react'

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

const UserListTable = ({userData}) => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(...[userData])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Hooks
  const { lang: locale } = useParams()

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

  const handleChangePassword = (id) => {
    setOpenChangePassword(true);
    setSelectedUserId(id);
    console.log("Change password for user ID:", id);
  }

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
      columnHelper.accessor('fullName', {
        header: 'User',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {getAvatar({ avatar: `${process.env.NEXT_PUBLIC_ASSET_URL}${row.original?.profile_image}`, fullName: row.original?.first_name+" "+row.original?.last_name })}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {`${row.original?.first_name ?? ""} ${row.original?.last_name ?? ""}`.trim()}
              </Typography>
              <Typography variant='body2'>{row.original?.username}</Typography>
            </div>
          </div>
        )
      }),

      // columnHelper.accessor('role', {
      //   header: 'Role',
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-2'>
      //       <Icon
      //         className={userRoleObj[row.original?.role].icon}
      //         sx={{ color: `var(--mui-palette-${userRoleObj[row.original?.role].color}-main)` }}
      //       />
      //       <Typography className='capitalize' color='text.primary'>
      //         {row.original?.role}
      //       </Typography>
      //     </div>
      //   )
      // }),
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
      columnHelper.accessor('department', {
        header: 'Department',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original?.department?.name}
          </Typography>
        )
      }),

      // columnHelper.accessor('division', {
      //   header: 'Division',
      //   cell: ({ row }) => (
      //     <Typography className='capitalize' color='text.primary'>
      //       {row.original?.division?.division_name}
      //     </Typography>
      //   )
      // }),
      columnHelper.accessor('designation', {
        header: 'Designation',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original?.designation?.name}
          </Typography>
        )
      }),
      columnHelper.accessor('state', {
        header: 'State',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original?.state?.state_name}
          </Typography>
        )
      }),
      columnHelper.accessor('city', {
        header: 'City',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original?.city?.city_name}
          </Typography>
        )
      }),
      columnHelper.accessor('validUpto', {
        header: 'Valid Up to',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {new Date(row.original?.expiry_date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
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
      columnHelper.accessor('action', {
        header: 'Actions',
        cell: ({ row }) => (
          <OptionMenu
            iconClassName='text-textSecondary'
            options={[
              {
                text: 'Change Password',
                icon: 'tabler-key',
                menuItemProps: {
                  onClick: () => handleChangePassword(row.original.id)
                },
              },
            ]}
          />
        ),
        enableSorting: false
      })
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
              placeholder='Search User'
              className='max-sm:is-full'
            />
            {/* <Button
              color='secondary'
              variant='tonal'
              startIcon={<i className='tabler-upload' />}
              className='max-sm:is-full'
            >
              Export
            </Button> */}
            <Link href={getLocalizedUrl('/branch/user/add', locale)}>
              <Button
                variant='contained'
                startIcon={<i className='tabler-plus' />}
                className='max-sm:is-full'
              >
                Add New User
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
      <AddUserDrawer
        open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        userData={data}
        setData={setData}
      />
      <ChangePasswordDialog open={openChangePassword} onClose={() => {setOpenChangePassword(false); setSelectedUserId(null); }} userId={selectedUserId} />
    </>
  )
}

export default UserListTable
