import React, { useMemo, useEffect } from 'react';

import {
  Autocomplete,
  Checkbox,
  ListSubheader,
  Tooltip,
  Typography,
} from '@mui/material';

import Grid from '@mui/material/Grid2'

import { Controller, useWatch } from 'react-hook-form';

import CustomTextField from '@/@core/components/mui/TextField';
import CustomAvatar from '@/@core/components/mui/Avatar';

const LocationAutocomplete = ({
  control,
  errors,
  locationOptions,
  loading,
  handleInputChange,
  fallbackSelected,
  setFallbackSelected
}) => {
  const selectedIds = useWatch({ control, name: 'location' }) || [];

  // Selected city objects from locationOptions or fallbackSelected
  const selectedValues = useMemo(() => {
    return selectedIds
      .map(id => locationOptions.find(opt => opt.id === id) || fallbackSelected.find(opt => opt.id === id))
      .filter(Boolean);
  }, [selectedIds, locationOptions, fallbackSelected]);

  // Merge locationOptions with selectedValues (to ensure all selected stay visible)
  const combinedOptions = useMemo(() => {
    const all = [...locationOptions, ...selectedValues];

    return Array.from(new Map(all.map(item => [item.id, item])).values());
  }, [locationOptions, selectedValues]);

  // Group cities by state_name
  const groupedCities = useMemo(() => {

    return combinedOptions.reduce((acc, city) => {
      if (!acc[city.state_name]) acc[city.state_name] = [];
      acc[city.state_name].push(city);

      return acc;
    }, {});
  }, [combinedOptions]);

  // Sync fallbackSelected to maintain visibility of selected options not in locationOptions
  useEffect(() => {
    const missing = selectedIds
      .map(id => locationOptions.find(opt => opt.id === id))
      .filter(Boolean);

    setFallbackSelected(prev => {
      const combined = [...prev, ...missing];

      return combined.filter((v, i, arr) => arr.findIndex(x => x.id === v.id) === i);
    });
  }, [locationOptions, selectedIds, setFallbackSelected]);

  return (
    <Grid size={{ xs:12, sm:6 }}>
      <Controller
        control={control}
        name="location"
        rules={{ required: 'This field is required' }}
        render={({ field }) => {
          const handleGroupToggle = (group) => {
            const groupCities = groupedCities[group] || [];
            const groupIds = groupCities.map(city => city.id);
            const current = field.value || [];

            const isFullySelected = groupIds.every(id => current.includes(id));

            const newSelection = isFullySelected
              ? current.filter(id => !groupIds.includes(id))
              : Array.from(new Set([...current, ...groupIds]));

            field.onChange(newSelection);
          };

          return (
            <Autocomplete
              multiple
              fullWidth
              loading={loading}
              disableCloseOnSelect
              options={combinedOptions}
              groupBy={(option) => option.state_name}
              value={selectedValues}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) => option.city_name}
              onChange={(e, newValue) => {
                field.onChange(newValue.map(opt => opt.id));
              }}
              onInputChange={(e, value, reason) => {
                if (reason === 'input' && value.length >= 3) {
                  handleInputChange(e, value);
                }
              }}
              renderGroup={(params) => {
                const group = params.group;
                const allSelected = groupedCities[group]?.every(city => (field.value || []).includes(city.id));
                const someSelected = groupedCities[group]?.some(city => (field.value || []).includes(city.id));

                return [
                  <ListSubheader key={`header-${group}`} style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      size="small"
                      checked={!!allSelected}
                      indeterminate={!allSelected && someSelected}
                      onChange={() => handleGroupToggle(group)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ marginRight: 8 }}
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
                      size="small"
                      checked={selected}
                      onClick={(e) => e.stopPropagation()}
                      style={{ marginRight: 8 }}
                    />
                    {option.city_name}
                  </li>
                );
              }}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label={<>Location <span className="text-error">*</span>
                  <Tooltip
                    title={
                      <Typography variant='body2' component='span' className='text-inherit'>
                        If a specific city or location is not listed, please select the nearest available option or contact the administrator. (You can also add it and wait for approve before using it.)
                      </Typography>
                    }
                  >
                    <i className='tabler-info-circle text-sm cursor-pointer' />
                  </Tooltip>
                  </>}
                  error={!!errors?.location}
                  helperText={errors?.location?.message}
                />
              )}
            />
          );
        }}
      />
    </Grid>
  );
};

export default LocationAutocomplete;
