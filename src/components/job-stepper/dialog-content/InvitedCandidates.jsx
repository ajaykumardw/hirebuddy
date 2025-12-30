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

const InvitedCandidates = ({candidateData}) => {

  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false);
  const [inviteTypes, setInviteTypes] = useState(['email']);

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

  //   if(selectValue){
  //     setValue(selectValue);
  //   }

  // }, [selectValue])

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
      columnHelper.accessor('full_name', {
        header: 'Full Name',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original?.full_name}
          </Typography>
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
      columnHelper.accessor('invite_type', {
        header: 'Invite Type',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            {row.original?.invite_type?.map((type, index) => (
              getInviteIcon(type, index)
            ))}
          </div>
        )
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
  )

  const table = useReactTable({
    data: candidateData || [],
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

        toast.success(data?.message || 'Invitation sent successfully!', {
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
    <>
      <DialogTitle>
        Invited Candidates
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
            {/* <div className="flex flex-col max-sm:is-full">
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
            </div> */}
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

export default InvitedCandidates;
