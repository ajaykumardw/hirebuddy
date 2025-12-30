'use client'

import { useState, useEffect, useRef } from 'react'

import { Controller } from 'react-hook-form'

import { MenuItem, TextField } from '@mui/material'

import { startOfMonth, endOfMonth, subDays } from 'date-fns'

import Grid from "@mui/material/Grid2";

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker';

const DateFilterWithPicker = ({ control, errors, setValue }) => {

  // const [startDateRange, setStartDateRange] = useState(startOfMonth(new Date()))
  // const [endDateRange, setEndDateRange] = useState(endOfMonth(new Date()))
  const myDateRef = useRef(null);

  const [startDateRange, setStartDateRange] = useState(null)
  const [endDateRange, setEndDateRange] = useState(null)
  const [mounted, setMounted] = useState(false)

  // useEffect(() => {
  //   const now = new Date()
  //   const start = startOfMonth(now)
  //   const end = endOfMonth(now)

  //   setStartDateRange(start)
  //   setEndDateRange(end)
  //   setValue('date', [start, end])
  //   setMounted(true) // ✅ hydration-safe render
  // }, [setValue])

  useEffect(() => {
    const now = new Date()
    const start = subDays(now, 30) // ✅ 30 days ago
    const end = now               // ✅ today

    setStartDateRange(start)
    setEndDateRange(end)
    setValue('date', [start, end])
    setMounted(true) // ✅ hydration-safe render
  }, [setValue])

  if (!mounted) return null // 👈 prevent initial mismatch

  const handleOnChangeRange = dates => {
    const [start, end] = dates

    setStartDateRange(start)
    setEndDateRange(end)
  }

  return (
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <AppReactDatepicker
            todayButton='Today'
            selectsRange
            monthsShown={2}
            startDate={field.value?.[0] || startDateRange}
            endDate={field.value?.[1] || endDateRange}
            onChange={(dates) => {
              const [start, end] = dates

              setStartDateRange(start)
              setEndDateRange(end)

              field.onChange(dates) // update react-hook-form value
            }}
            showYearDropdown
            showMonthDropdown
            dateFormat="yyyy/MM/dd"
            placeholderText="YYYY/MM/DD"
            customInput={
              <TextField
                {...field}
                size='small'
                fullWidth
                label="Date"
                error={!!errors?.date}
                helperText={errors?.date?.message}
                ref={myDateRef}
              />
            }
          />
        )}
      />
    </Grid>
  )
}

export default DateFilterWithPicker
