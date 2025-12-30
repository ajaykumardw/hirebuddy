import { useEffect, useMemo, useState } from "react";

import { useParams } from "next/navigation";

import Link from "next/link";

import IconButton from '@mui/material/IconButton'

import { TabContext, TabList, TabPanel } from "@mui/lab";

import { Button, Checkbox, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, FormControlLabel, FormGroup, MenuItem, Tab, TablePagination, Typography } from "@mui/material";


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

import classnames from "classnames";

import { useSession } from "next-auth/react";

import { toast } from "react-toastify";

import tableStyles from '@core/styles/table.module.css'

import TablePaginationComponent from "@/components/TablePaginationComponent";

import CustomAvatar from '@core/components/mui/Avatar'

import DialogCloseButton from "@/components/dialogs/DialogCloseButton";

import { formatToLacOrCr } from '@/utils/formatCTC'

import { getInitials } from '@/utils/getInitials'

import { getLocalizedUrl } from '@/utils/i18n'

// import tableStyles from '@core/styles/table.module.css'
import { monthsOpt, yearsOpt } from '@/configs/customDataConfig'

import CustomTextField from "@/@core/components/mui/TextField";

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


const userStatusObj = {
  1: 'success',

  // pending: 'warning',

  0: 'secondary'
}


const columnHelper = createColumnHelper()

const MatchedCandidateDialog = ({open, handleClose, candidateData, appliedCandidates, selectValue, jobId}) => {

  const [value, setValue] = useState(selectValue || '30%')
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false);
  const [inviteTypes, setInviteTypes] = useState(['email']);

  console.log("candidateData:", candidateData);

  const toggleType = (type) => {
    setInviteTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const { data: session } = useSession()
  const token = session?.user?.token

  useEffect(() => {

    if(selectValue){
      setValue(selectValue);
    }

  }, [selectValue])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const { lang: locale } = useParams()

  // console.log("matched candidates", candidateData?.['30%'], selectValue)

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
              <Link target="blank" href={getLocalizedUrl(`/head-office/candidates/${row.original.id}/view`, locale)} className='flex'>
                <i className='tabler-eye text-textSecondary' />
              </Link>
            </IconButton>
            {/* <IconButton>
              <Link href={getLocalizedUrl(`/candidates/${row.original.id}/edit`, locale)} className='flex'>
                <i className='tabler-edit text-textSecondary' />
              </Link>
            </IconButton> */}
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
      columnHelper.accessor('invited_by_name', {
        header: 'Invited By',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original?.invited_by_name}
          </Typography>
        )
      }),
      columnHelper.accessor('invited_at', {
        header: 'Invited At',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original?.invited_at}
          </Typography>
        )
      }),
      columnHelper.accessor('full_name', {
        header: 'Candidate',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {getAvatar({ avatar: row.original?.profile_image, fullName: row.original?.full_name })}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original?.full_name}
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
    data: appliedCandidates ? candidateData : candidateData?.[value] || [],
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

  const selectedIds = useMemo(
    () => table.getSelectedRowModel().rows.map(r => r.original.id),
    [table.getSelectedRowModel()]
  );

  // console.log("selected id:", selectedIds);

  const handleInviteSend = async (inviteTypes) => {

    // setRowSelection({});

    if(!token) return

    setLoading(true);

    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/invite`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({
          selectedIds : selectedIds,
          inviteTypes
        })
      });

      if(res.ok) {

        const data = await res.json();

        toast.success(data?.message || 'Mail sent successfully!', {
          autoClose: 10000,
          hideProgressBar: false,
        });

        console.log("data from invite sent:", data);
      }

    } catch (error) {

      toast.error('Something went wrong.', {
        autoClose: 10000,
        hideProgressBar: false,
      });

      console.log("error:", error);


    } finally {
      setLoading(false);
      handleClose();
      setRowSelection({});
    }



  }

  const getAvatar = params => {
    const { avatar, fullName } = params

    if (avatar) {
      return <CustomAvatar src={avatar} size={34} />
    } else {
      return <CustomAvatar size={34}>{getInitials(fullName)}</CustomAvatar>
    }
  }

  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='xl'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={() => {handleClose(); setRowSelection({});}}>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle>
        {appliedCandidates ? 'Applied Candidates' : 'Matched Candidates'}
        {/* Matched Candidates */}
      </DialogTitle>
      <DialogContent>
        <TabContext value={value}>
          {appliedCandidates ||
          <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
            <Tab value='100%' label='100%' />
            <Tab value='70%' label='70%' />
            <Tab value='50%' label='50%' />
            <Tab value='30%' label='30%' />
          </TabList> }
          <TabPanel value={value} className='pbs-0'>

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
                {/* <Button
                  color='secondary'
                  variant='tonal'
                  startIcon={<i className='tabler-upload' />}
                  className='max-sm:is-full'
                >
                  Export
                </Button> */}
                {/* {appliedCandidates ||
                <div className="flex flex-col max-sm:is-full">
                  <Button
                    color='primary'
                    variant='contained'
                    startIcon={loading ? <CircularProgress size={18} color='inherit' /> : <i className='tabler-send' />}
                    className='max-sm:is-full'
                    disabled={selectedIds.length <= 0 || loading || inviteTypes.length === 0}
                    onClick={() => handleInviteSend(inviteTypes)}
                  >
                    {loading ? 'Inviting...' : 'Invite'}
                  </Button>
                  <FormGroup row>
                    <FormControlLabel
                      control={<Checkbox checked={inviteTypes.includes('whatsapp')} onChange={() => toggleType('whatsapp')} />}
                      label="WhatsApp"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={inviteTypes.includes('sms')} onChange={() => toggleType('sms')} />}
                      label="SMS"
                      disabled
                    />
                    <FormControlLabel
                      control={<Checkbox checked={inviteTypes.includes('email')} onChange={() => toggleType('email')} />}
                      label="Email"
                    />
                  </FormGroup>
                </div>} */}
                {/* <Link href={getLocalizedUrl('/candidates/add', locale)}>
                  <Button
                    variant='contained'
                    startIcon={<i className='tabler-plus' />}
                    className='max-sm:is-full'
                  >
                    Add Candidate
                  </Button>
                </Link> */}
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
          </TabPanel>
        </TabContext>
      </DialogContent>
    </Dialog>
  )
}

export default MatchedCandidateDialog;
