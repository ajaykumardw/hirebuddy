import { useEffect, useMemo, useState } from "react";

import { useParams } from "next/navigation";

import Link from "next/link";

import IconButton from '@mui/material/IconButton'

import { TabContext, TabList, TabPanel } from "@mui/lab";

import { Button, Checkbox, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, FormControlLabel, FormGroup, MenuItem, Tab, TablePagination, TextField, Tooltip, Typography } from "@mui/material";


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

import { format, parseISO, setHours, setMinutes } from "date-fns";

import { Controller, useForm } from "react-hook-form";

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
import AppReactDatepicker from "@/libs/styles/AppReactDatepicker";

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

const InterviewScheduled = ({handleClose, setJobData, candidateData, jobId}) => {

  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [data, setData] = useState(candidateData || []);
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false);
  const [inviteTypes, setInviteTypes] = useState(['whatsapp']);

  useEffect(() => {
    setData(candidateData || []);
  }, [candidateData]);

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
  //   if (candidateData && approvedCandidateIds.length > 0) {

  //     const selected = {};

  //     candidateData.forEach(candidate => {
  //       if (approvedCandidateIds.includes(candidate.id)) {
  //         selected[candidate.id] = true;
  //       }
  //     });
  //     setRowSelection(selected);
  //   }
  // }, [candidateData, approvedCandidateIds]);

  // useEffect(() => {

  //   if(selectValue){
  //     setValue(selectValue);
  //   }

  // }, [selectValue])

  // const handleChange = (event, newValue) => {
  //   setValue(newValue)
  // }

  // // 🔹 Helper to update pivot fields in central state
  // const handleFieldChange = (rowIndex, field, value) => {
  //   console.log("on change:", rowIndex, field, value)
  //   setData((prev) =>
  //     prev.map((row, i) =>
  //       row.id === rowIndex
  //         ? {
  //             ...row,
  //             pivot: {
  //               ...row.pivot,
  //               [field]: value,
  //             },
  //           }
  //         : row
  //     )
  //   );
  // };

  const onSaveRow = async (rowId) => {
    const values = watch(rowId.toString()); // get current values for that row

    console.log("save button", rowId, values)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/interview-schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ candidateId: rowId, ...values }),
      });

      const result = await res.json();

      if(res.ok) {

        toast.success(result?.message || "Interview updated!", {
          autoClose: 10000,
          hideProgressBar: false,
        });
        setJobData(result?.job)
      } else {
        toast.error(result?.message || 'Failed to interview schedule', {
          autoClose: 10000,
          hideProgressBar: false,
        });
      }
    } catch (err) {
      toast.error("Failed to save", {
        autoClose: 10000,
        hideProgressBar: false,
      });
    }
  };


  const { lang: locale } = useParams()

  console.log("can:", candidateData)

  // const getInviteIcon = (type, index) => {
  //   switch (type) {
  //     case 'sms':
  //       return (
  //         <Tooltip title="SMS" key={index}>
  //           <CustomIconButton size="small" variant="tonal" color="error"><i className="tabler-phone" /></CustomIconButton>
  //         </Tooltip>
  //       );
  //     case 'whatsapp':
  //       return (
  //         <Tooltip title="WhatsApp" key={index}>
  //           <CustomIconButton size="small" variant="tonal" color="success"><i className="tabler-brand-whatsapp" /></CustomIconButton>
  //         </Tooltip>
  //       );
  //     case 'email':
  //       return (
  //         <Tooltip title="Email" key={index}>
  //           <CustomIconButton size="small" variant="tonal" color="primary"><i className="tabler-mail" /></CustomIconButton>
  //         </Tooltip>
  //       );
  //     default:
  //       return null;
  //   }
  // };


  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: candidateData?.reduce((acc, row) => {
      const date = row.pivot?.interview_date; // e.g. "2025-09-17"
      const startTime = row.pivot?.interview_start_time; // e.g. "15:30:00"
      const endTime = row.pivot?.interview_end_time;     // e.g. "16:30:00"

      acc[row.id.toString()] = {
        interview_type: row.pivot?.interview_type || "",
        interview_date: date ? new Date(date) : null,
        interview_start_time:
          date && startTime ? new Date(`${date}T${startTime}`) : null,
        interview_end_time:
          date && endTime ? new Date(`${date}T${endTime}`) : null,
        interview_address: row.pivot?.interview_address || "",
        interview_platform: row.pivot?.interview_platform || "",
        meeting_id: row.pivot?.meeting_id || "",
        passcode: row.pivot?.passcode || "",
        interview_contact_person: row.pivot?.interview_contact_person || "",
      };

      return acc;
    }, {}) || {},
  });


  const columns = useMemo(
    () => [
      // ... your other columns
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

        columnHelper.accessor("pivot.interview_type", {
          header: "Interview Type",
          cell: ({ row }) => (
            row.original?.pivot?.interview_type === 1 ? <Typography>Physical</Typography> : row.original?.pivot?.interview_type === 2 ? <Typography>Virtual</Typography> :
            <Controller
              name={`${row.original.id}.interview_type`}
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  select
                  fullWidth
                >
                  <MenuItem value="1">Physical</MenuItem>
                  <MenuItem value="2">Virtual</MenuItem>
                </CustomTextField>
              )}
            />
          ),
        }),
        columnHelper.accessor("pivot.interview_date", {
          header: "Interview Date",
          cell: ({ row }) => (
            row.original?.pivot?.interview_date ? <Typography>{format(row.original?.pivot?.interview_date, 'dd-MMM-yyyy')}</Typography> :
            <Controller
              name={`${row.original.id}.interview_date`}
              control={control}
              render={({ field }) => (
                <AppReactDatepicker
                  minDate={new Date()}
                  selected={field.value ? new Date(field.value) : null} // Convert to Date
                  onChange={field.onChange}                             // Update react-hook-form
                  customInput={<CustomTextField fullWidth />}
                />
              )}
            />
          ),
        }),
        columnHelper.accessor("pivot.interview_start_time", {
          header: "Start Time",
          cell: ({ row }) => (
            row.original?.pivot?.interview_start_time ? <Typography>{format(new Date(`${row.original.pivot.interview_date}T${row.original.pivot.interview_start_time}`), "h:mm a")}</Typography> :
            <Controller
              name={`${row.original?.id}.interview_start_time`}
              control={control}
              render={({ field }) => (
                <AppReactDatepicker
                  selected={field.value ? new Date(field.value) : null} // Convert string to Date
                  onChange={field.onChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  dateFormat="h:mm aa"
                  minTime={setHours(setMinutes(new Date(), 0), 9)}
                  maxTime={setHours(setMinutes(new Date(), 0), 18)}
                  customInput={<CustomTextField fullWidth className="min-w-[100px]" />}
                />
              )}
            />
          ),
        }),
        columnHelper.accessor("pivot.interview_end_time", {
          header: "End Time",
          cell: ({ row }) => (
            row.original?.pivot?.interview_end_time ? <Typography>{format(new Date(`${row.original.pivot.interview_date}T${row.original.pivot.interview_end_time}`), "h:mm a")}</Typography> :
            <Controller
              name={`${row.original.id}.interview_end_time`}
              control={control}
              render={({ field }) => (
                <AppReactDatepicker
                  selected={field.value ? new Date(field.value) : null} // Convert string to Date
                  onChange={field.onChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  dateFormat="h:mm aa"
                  minTime={setHours(setMinutes(new Date(), 0), 9)}
                  maxTime={setHours(setMinutes(new Date(), 0), 18)}
                  customInput={<CustomTextField fullWidth className="min-w-[100px]" />}
                />
              )}
            />
          ),
        }),
        columnHelper.accessor("pivot.interview_address", {
          header: "Venue",
          cell: ({ row }) => {

            const interviewType = watch(`${row.original.id}.interview_type`);
            const isDisabled = interviewType === "2"; // Virtual

            return (
              row.original?.pivot?.interview_address ? <Typography>{row.original?.pivot?.interview_address}</Typography> :
              row.original?.pivot?.interview_type === 2 ? null :
              <Controller
                name={`${row.original.id}.interview_address`}
                control={control}
                disabled={isDisabled}
                render={({ field }) => <CustomTextField {...field} fullWidth className="min-w-[200px]" />}
              />
            );
          },
        }),
        columnHelper.accessor("pivot.interview_contact_person", {
          header: "Contact Person",
          cell: ({ row }) => {

            const interviewType = watch(`${row.original.id}.interview_type`);
            const isDisabled = interviewType === "2"; // Virtual

            return (
              row.original?.pivot?.interview_contact_person ? <Typography>{row.original?.pivot?.interview_contact_person}</Typography> :
              row.original?.pivot?.interview_type === 2 ? null :
              <Controller
                name={`${row.original.id}.interview_contact_person`}
                control={control}
                disabled={isDisabled}
                render={({ field }) => <CustomTextField {...field} fullWidth size="small" />}
              />
            );
          },
        }),
        columnHelper.accessor("pivot.interview_platform", {
          header: "Interview Platform",
          cell: ({ row }) => {

            const interviewType = watch(`${row.original.id}.interview_type`);
            const isDisabled = interviewType === "1"; // Physical

            const platforms = [
              { value: "1", label: "Microsoft Teams" },
              { value: "2", label: "Zoom" },
              { value: "3", label: "Google Meet" },
            ];

            return (
              row.original?.pivot?.interview_platform ? <Typography>{platforms.find(p => Number(p.value) === Number(row.original.pivot.interview_platform))?.label}</Typography> :
              row.original?.pivot?.interview_type === 1 ? null :
              <Controller
                name={`${row.original.id}.interview_platform`}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    disabled={isDisabled}
                  >
                    {platforms.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            );
          },
        }),
        columnHelper.accessor("pivot.meeting_id", {
          header: "Meeting ID",
          cell: ({ row }) =>  {

            const interviewType = watch(`${row.original.id}.interview_type`);
            const isDisabled = interviewType === "1"; // Physical

            return (
              row.original?.pivot?.meeting_id ? <Typography>{row.original?.pivot?.meeting_id}</Typography> :
              row.original?.pivot?.interview_type === 1 ? null :
              <Controller
                name={`${row.original.id}.meeting_id`}
                control={control}
                disabled={isDisabled}
                render={({ field }) => <CustomTextField {...field} fullWidth className="min-w-[200px]" />}
              />
            );
          },
        }),
        columnHelper.accessor("pivot.passcode", {
          header: "Passcode",
          cell: ({ row }) => {

            const interviewType = watch(`${row.original.id}.interview_type`);
            const isDisabled = interviewType === "1"; // Physical

            return (
              row.original?.pivot?.passcode ? <Typography>{row.original?.pivot?.passcode}</Typography> :
              row.original?.pivot?.interview_type === 1 ? null :
              <Controller
                name={`${row.original.id}.passcode`}
                control={control}
                disabled={isDisabled}
                render={({ field }) => <CustomTextField {...field} fullWidth className="min-w-[200px]" />}
              />
            );
          },
        }),
        {
          id: "actions",
          header: "Actions",
          cell: ({ row, table }) => {
            const rowValues = watch(row.original.id.toString()); // current row
            const allRows = table.getRowModel().rows;            // all rows
            const rowIndex = allRows.findIndex(r => r.original.id === row.original.id);

            // check if row has pivot (already saved)
            if (row.original?.pivot?.interview_date) return null;

            // check if Save button should be disabled
            // const isDisabled = !rowValues?.interview_date ||
            //                   !rowValues?.interview_start_time ||
            //                   !rowValues?.interview_address ||
            //                   !rowValues?.interview_contact_person;

            const interviewType = rowValues?.interview_type;

            const isDisabled = !interviewType ||
                              !rowValues?.interview_date ||
                              !rowValues?.interview_start_time ||
                              (interviewType === "1" ? !rowValues?.interview_address : !rowValues?.interview_platform) ||
                              (interviewType === "1" ? !rowValues?.interview_contact_person : (!rowValues?.meeting_id && !rowValues?.passcode));

            const copyPrevious = () => {
              if (rowIndex > 0) {
                const prevRow = allRows[rowIndex - 1];
                const prevValues = watch(prevRow.original.id.toString());

                if (prevValues) {
                  setValue(`${row.original.id}.interview_type`, prevValues.interview_type);
                  setValue(`${row.original.id}.interview_date`, prevValues.interview_date);
                  setValue(`${row.original.id}.interview_start_time`, prevValues.interview_start_time);
                  setValue(`${row.original.id}.interview_end_time`, prevValues.interview_end_time);
                  setValue(`${row.original.id}.interview_address`, prevValues.interview_address);
                  setValue(`${row.original.id}.interview_contact_person`, prevValues.interview_contact_person);
                  setValue(`${row.original.id}.interview_platform`, prevValues.interview_platform);
                  setValue(`${row.original.id}.meeting_id`, prevValues.meeting_id);
                  setValue(`${row.original.id}.passcode`, prevValues.passcode);
                }
              }
            };

            return (
              <div className="flex gap-2">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={copyPrevious}
                  disabled={rowIndex === 0} // disable for first row
                >
                  Same as Previous
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onSaveRow(row.original.id)}
                  disabled={isDisabled}
                >
                  Save
                </Button>
              </div>
            );
          }
        }


    ],
    [control]
  )

  const table = useReactTable({
    data: data || [],
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
    enableRowSelection: row => row.original?.pivot?.interview_date, // or enable row selection conditionally per row
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

  // const newSelectedIds = useMemo(
  //   () => selectedIds.filter(id => !approvedCandidateIds.includes(id)),
  //   [selectedIds, approvedCandidateIds]
  // );

  console.log("selected id:", selectedIds);

  const handleSendInterviewDate = async (inviteTypes) => {

    // setRowSelection({});

    if(!token) return

    setLoading(true);

    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/send-interview-date`, {
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

        toast.success(data?.message || 'Interview sent successfully!', {
          autoClose: 10000,
          hideProgressBar: false,
        });
        setJobData(data?.job);

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
        Interview Schedule
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
            <div className="flex flex-col max-sm:is-full">
              <Button
                color='primary'
                variant='contained'
                startIcon={loading ? <CircularProgress size={18} color='inherit' /> : <i className='tabler-check' />}
                className='max-sm:is-full'
                disabled={selectedIds.length <= 0 || loading || inviteTypes.length === 0}
                onClick={() => handleSendInterviewDate(inviteTypes)}
              >
                {loading ? 'Sending...' : 'Send Interview Date'}
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

export default InterviewScheduled;
