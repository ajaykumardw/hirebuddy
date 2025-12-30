import { useEffect, useMemo, useState } from "react";

import { useParams } from "next/navigation";

import Link from "next/link";

import IconButton from '@mui/material/IconButton'

import { TabContext, TabList, TabPanel } from "@mui/lab";

import { Button, Checkbox, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, FormControlLabel, FormGroup, MenuItem, Tab, TablePagination, Tooltip, Typography } from "@mui/material";


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
import CustomIconButton from "@/@core/components/mui/IconButton";

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

const OnboardedCandidates = ({handleClose, candidateData, jobId, setJobData, onboardedCandidateIds, notOnboardedCandidateIds}) => {

  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false);

  const toggleType = (type) => {
    setInviteTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const { data: session } = useSession()
  const token = session?.user?.token

  // useEffect(() => {
  //   if (candidateData && onboardedCandidateIds?.length > 0) {

  //     const selected = {};

  //     candidateData.forEach(candidate => {
  //       if (onboardedCandidateIds.includes(candidate.id)) {
  //         selected[candidate.id] = true;
  //       }
  //     });
  //     setRowSelection(selected);
  //   }
  // }, [candidateData, onboardedCandidateIds]);

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const { lang: locale } = useParams()

  console.log("can:", candidateData)

  const getInviteIcon = (type, index) => {
    switch (type) {
      case 'sms':
        return (
          <Tooltip title="SMS" key={index}>
            <CustomIconButton size="small" variant="tonal" color="error"><i className="tabler-phone" /></CustomIconButton>
          </Tooltip>
        );
      case 'whatsapp':
        return (
          <Tooltip title="WhatsApp" key={index}>
            <CustomIconButton size="small" variant="tonal" color="success"><i className="tabler-brand-whatsapp" /></CustomIconButton>
          </Tooltip>
        );
      case 'email':
        return (
          <Tooltip title="Email" key={index}>
            <CustomIconButton size="small" variant="tonal" color="primary"><i className="tabler-mail" /></CustomIconButton>
          </Tooltip>
        );
      default:
        return null;
    }
  };

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
          onboardedCandidateIds.includes(row.original.id) ? (
            <CustomAvatar color="success" size={24}><i className='tabler-check text-sm' /></CustomAvatar>
          ) : notOnboardedCandidateIds?.includes(row.original.id) ? (
            <CustomAvatar color="error" size={24}><i className='tabler-x text-sm' /></CustomAvatar>
          ) : (
            <Checkbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler()
              }}
            />
          )
        )
      },
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
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            {/* <IconButton onClick={() => setData(data?.filter(product => product.id !== row.original?.id))}>
              <i className='tabler-trash text-textSecondary' />
            </IconButton> */}
            <IconButton>
              <Link target="blank" href={getLocalizedUrl(`/candidates/${row.original.id}/view`, locale)} className='flex'>
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
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
  )

  const table = useReactTable({
    data: candidateData || [],
    columns,
    getRowId: row => row.id,
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
    enableRowSelection: row => !row.original?.pivot?.onboarding && !notOnboardedCandidateIds.includes(row.original.id), // or enable row selection conditionally per row
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

  const newSelectedIds = useMemo(
    () => selectedIds.filter(id => !onboardedCandidateIds?.includes(id)),
    [selectedIds, onboardedCandidateIds]
  );

  console.log("selected id:", selectedIds);

  const handleOnboardedCandidates = async (isReject) => {

    // setRowSelection({});

    if(!token) return

    setLoading(true);

    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/onboard`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({
          selectedIds : selectedIds,
          reject: isReject
        })
      });

      const data = await res.json();

      if(res.ok) {

        toast.success(data?.message || 'Candidate offer letter accepted successfully!', {
          autoClose: 10000,
          hideProgressBar: false,
        });
        setJobData(data?.job);

        console.log("data from invite sent:", data);
      } else {
        toast.error(data?.message || 'Service not available right now. Please try again later.', {
          autoClose: 10000,
          hideProgressBar: false,
        });
      }

    } catch (error) {

      toast.error('Something went wrong.', {
        autoClose: 10000,
        hideProgressBar: false,
      });

      console.log("error:", error);


    } finally {
      setLoading(false);
      setRowSelection({});
      handleClose()
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
    <>
      <DialogTitle>
        Onboarded Candidates
        {/* Matched Candidates */}
      </DialogTitle>
      <DialogContent>
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
            <Button
              color='error'
              variant='contained'
              startIcon={loading ? <CircularProgress size={18} color='inherit' /> : <i className='tabler-x' />}
              className='max-sm:is-full'
              disabled={newSelectedIds.length <= 0 || loading}
              onClick={() => handleOnboardedCandidates(true)}
            >
              {loading ? 'Updating...' : 'Not Joined'}
            </Button>
            <div className="flex flex-col max-sm:is-full">
              <Button
                color='primary'
                variant='contained'
                startIcon={loading ? <CircularProgress size={18} color='inherit' /> : <i className='tabler-check' />}
                className='max-sm:is-full'
                disabled={newSelectedIds.length <= 0 || loading}
                onClick={() => handleOnboardedCandidates()}
              >
                {loading ? 'Updating...' : 'Onboarded'}
              </Button>

              {/* <FormGroup row>
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
              </FormGroup> */}
            </div>
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
      </DialogContent>
    </>
  )
}

export default OnboardedCandidates;
