import React, { useState, useMemo } from 'react';

import { useSession } from 'next-auth/react';

import { Autocomplete, Chip, Box, CircularProgress } from '@mui/material';

import { Controller } from 'react-hook-form';

import { toast } from 'react-toastify';

import debounce from 'lodash.debounce';

import CustomTextField from '@/@core/components/mui/TextField';
import { getNestedValue } from '@/utils/getNestedValue';

const SkillSearchOnly = ({ name, label, control, errors, selectedSkills, setSelectedSkills }) => {
  const [skillsData, setSkillsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { data: session } = useSession();
  const token = session?.user?.token;

  console.log('Selected Skills:', selectedSkills);

  const fetchSkills = async (query) => {
    if (!token || !query || query.trim().length < 2) {
      setSkillsData([]);

      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills?search=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();

        setSkillsData(data?.skills || []);
      } else {
        setSkillsData([]);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      setSkillsData([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useMemo(() => debounce(fetchSkills, 400), [token]);

  const addSkillAPI = async (skillName) => {

    if (!token) return null;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: skillName }),
      });

      const data = await res.json();

      if (res.ok) {
        return data.skill;
      } else if(res.status === 422) {
        toast.error(data.errors?.name?.[0] || 'Validation error', {
          autoClose: 10000,
          hideProgressBar: false,
        });
      } else {
        toast.error(data.message || 'Failed to add skill', {
          autoClose: 10000,
          hideProgressBar: false,
        });
        console.log('Failed to add skill:', data);

        return null;
      }
    } catch (error) {
      console.log('Error adding skill:', error);

      return null;
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const selectedIds = field.value || [];

        // 👇 convert selected IDs to skill objects for chips
        // const selectedSkills = skillsData.filter(skill =>
        //   selectedIds.includes(skill.id)
        // );

        return (
          <Box>
            <Autocomplete
              fullWidth
              multiple
              freeSolo
              options={skillsData}
              value={[]}
              getOptionLabel={(option) =>
                typeof option === 'string'
                  ? option
                  : option.isNew
                  ? `Add "${option.name}"`
                  : option.name || ''
              }
              filterOptions={(options, params) => {
                const filtered = options;
                const { inputValue } = params;

                if (
                  inputValue.trim().length >= 2 &&
                  !options.some((o) => o.name === inputValue)
                ) {
                  filtered.push({ name: inputValue, id: inputValue, isNew: true });
                }

                return filtered;
              }}
              filterSelectedOptions
              loading={loading}
              onInputChange={(e, value) => {
                setInputValue(value);
                debouncedFetch(value);
              }}
              onChange={async (event, newValue) => {
                if (!newValue) return;
                const values = Array.isArray(newValue) ? newValue : [newValue];

                for (const item of values) {
                  let skillObj = item;

                  if (item.isNew) {
                    const created = await addSkillAPI(item.name);

                    if (!created) continue;
                    skillObj = created;
                  }

                  if (!(field.value || []).includes(skillObj.id)) {
                    field.onChange([...(field.value || []), skillObj.id]);
                    setSelectedSkills((prev) => [...prev, skillObj]);
                  }
                }

                setInputValue('');
                setSkillsData([]);
              }}
              noOptionsText={inputValue.trim().length > 2 ? 'No options' : 'Type skills...'}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label={label || "Key Skills"}
                  error={!!getNestedValue(errors, name)}
                  helperText={getNestedValue(errors, `${name}.message`)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            {selectedSkills.length > 0 && (
              <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                {selectedSkills.map((skill) => (
                  <Chip
                    key={skill.id}
                    label={skill.name}
                    color="primary"
                    variant="outlined"
                    onDelete={() => {
                      const newIds = (field.value || []).filter((id) => id !== skill.id);

                      field.onChange(newIds);
                      setSelectedSkills((prev) =>
                        prev.filter((s) => s.id !== skill.id)
                      );
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        );
      }}
    />
  );
};

export default SkillSearchOnly;
