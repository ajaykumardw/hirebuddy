import { useEffect, useMemo, useState } from "react";

import { useParams } from "next/navigation";

import Link from "next/link";

import IconButton from '@mui/material/IconButton'

import { TabContext, TabList, TabPanel } from "@mui/lab";

import { Button, Checkbox, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, MenuItem, Tab, TablePagination, Typography } from "@mui/material";


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

const AssignBranchDialog = ({ open, handleClose, branchData, appliedCandidates, selectValue, jobId }) => {

    const [value, setValue] = useState(selectValue || '30%')
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState('')
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [loading, setLoading] = useState(false);

    const { data: session } = useSession()
    const token = session?.user?.token

    useEffect(() => {

        if (selectValue) {
            setValue(selectValue);
        }

    }, [selectValue])

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const { lang: locale } = useParams()

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
            columnHelper.accessor('business_name', {
                header: 'Branch',
                cell: ({ row }) => (
                    <div className='flex items-center gap-4'>
                        {getAvatar({ avatar: row.original?.profile_image, fullName: row.original?.business_name })}
                        <div className='flex flex-col'>
                            <Typography color='text.primary' className='font-medium'>
                                {row.original?.business_name}
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
            columnHelper.accessor('address', {
                header: 'Address',
                cell: ({ row }) => (
                    <Typography className='capitalize' color='text.primary'>
                        {row.original?.address}
                    </Typography>
                )
            }),

            // columnHelper.accessor('branch', {
            //   header: 'Branch',
            //   cell: ({ row }) => (
            //     <Typography className='capitalize' color='text.primary'>
            //       {row.original?.branch?.branch_name}
            //     </Typography>
            //   )
            // }),
            // columnHelper.accessor('division', {
            //   header: 'Division',
            //   cell: ({ row }) => (
            //     <Typography className='capitalize' color='text.primary'>
            //       {row.original?.division?.division_name}
            //     </Typography>
            //   )
            // }),
            // columnHelper.accessor('designation', {
            //   header: 'Designation',
            //   cell: ({ row }) => (
            //     <Typography className='capitalize' color='text.primary'>
            //       {row.original?.designation?.designation_name}
            //     </Typography>
            //   )
            // }),
            // columnHelper.accessor('stationHeadQuarter', {
            //   header: 'Station Head Quarter Code',
            //   cell: ({ row }) => (
            //     <Typography className='capitalize' color='text.primary'>
            //       {row.original?.station_head_quarter?.station_name}
            //     </Typography>
            //   )
            // }),
            // columnHelper.accessor('checkingAuthorityNo', {
            //   header: 'Checking Authority No.',
            //   cell: ({ row }) => (
            //     <Typography className='capitalize' color='text.primary'>
            //       {row.original?.authority_no}
            //     </Typography>
            //   )
            // }),
            columnHelper.accessor('expiry_date', {
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

            // columnHelper.accessor('taSrNo', {
            //   header: 'Ta Sr No.',
            //   cell: ({ row }) => (
            //     <Typography className='capitalize' color='text.primary'>
            //       {row.original?.ta_sr_no}
            //     </Typography>
            //   )
            // }),
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
        data: branchData || [],
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

    const handleAssignBranch = async () => {

        // setRowSelection({});

        if (!token) return

        setLoading(true);

        try {

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/assign-branch`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                method: 'POST',
                body: JSON.stringify({
                    selectedIds: selectedIds
                })
            });

            if (res.ok) {

                const data = await res.json();

                toast.success(data?.message || 'Assigned to branch successfully!', {
                  autoClose: 10000,
                  hideProgressBar: false,
                });

                console.log("data from assigned:", data);
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
            <DialogCloseButton onClick={() => { handleClose(); setRowSelection({}); }}>
                <i className='tabler-x' />
            </DialogCloseButton>
            <DialogTitle>
                Assign to Branch
            </DialogTitle>
            <DialogContent>
                <TabContext value={value}>
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
                                <Button
                                    color='primary'
                                    variant='contained'
                                    startIcon={loading ? <CircularProgress size={18} color='inherit' /> : <i className='tabler-send' />}
                                    className='max-sm:is-full'
                                    disabled={selectedIds.length <= 0 || loading}
                                    onClick={handleAssignBranch}
                                >
                                    {loading ? 'Assigning...' : 'Assign'}
                                </Button>
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

export default AssignBranchDialog;
