'use client'

import { useState } from "react";

import { useSession } from "next-auth/react";

import { useDropzone } from "react-dropzone";

import { toast } from "react-toastify";

import {
  Avatar, Dialog, DialogContent, DialogTitle,
  Divider, Typography, Table, TableHead, TableRow,
  TableCell, TableBody,
  FormHelperText,
  Button
} from "@mui/material"

import Grid from "@mui/material/Grid2"

import * as XLSX from 'xlsx';

import DialogCloseButton from "@/components/dialogs/DialogCloseButton";

import AppReactDropzone from "@/libs/styles/AppReactDropzone";

const UploadLocationDialog = ({ open, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [uploadedData, setUploadedData] = useState([]);
  const [apiErrors, setApiErrors] = useState([]);
  const { data: session } = useSession();
  const token = session?.user?.token;

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: 2000000, // 2 MB
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    disabled: loading,
    onDrop: async (acceptedFiles) => {
      setLoading(true);
      setUploadedData([]);
      setApiErrors([]);

      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        setUploadedData(jsonData); // show this in table

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/upload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ data: jsonData }),
          });

          const result = await res.json();

          if (result?.errors) {

            toast.info(result?.message || 'Some locations failed to upload');

            // Handle field-level errors
            if (result.errors) {
              const flatErrors = [];

              Object.entries(result.errors).forEach(([rowKey, fields]) => {
                Object.entries(fields).forEach(([field, messages]) => {
                  flatErrors.push({
                    key: `${rowKey}.${field}`, // e.g. "data.0.state"
                    message: messages[0] || 'Validation error'
                  });
                });
              });

              setApiErrors(flatErrors);
            }
          } else {
            toast.success(result?.message || 'Locations uploaded successfully!', {
              autoClose: 10000,
              hideProgressBar: false,
            });
          }
        } catch (err) {
          toast.error('Upload failed.', {
            autoClose: 10000,
            hideProgressBar: false,
          });
        } finally {
          setLoading(false);
        }
      }

      reader.readAsArrayBuffer(file);
    },
    onDropRejected: () => {
      toast.error('Only one Excel file is allowed, and the size must be under 2 MB.', {
        autoClose: 10000,
        hideProgressBar: false,
      })
    }
  });

  // Get error message for specific row/column
  const getError = (rowIndex, field) => {
    const key = `data.${rowIndex}.${field}`;

    return apiErrors.find(e => e.key === key)?.message || null;
  }

  const isRowValid = (index) => {
    return !apiErrors.some(e => e.key.startsWith(`data.${index}.`));
  };

  const handleResetClose = () => {
    handleClose();
    setUploadedData([]);
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleResetClose}
      maxWidth='lg'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleResetClose}>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle>Upload Locations</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12 }}>
            <div className="flex gap-2">
              <Button variant="tonal" color="success" href="/sample-file/state_excel_file.xlsx">
                Download State
              </Button>
              <Button variant="contained" href="/sample-file/bulk_locations_upload_sample_file.xlsx">
                Download Excel file
              </Button>
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <AppReactDropzone>
              <div {...getRootProps({ className: 'dropzone disabled' })}>
                <input {...getInputProps()} />
                <div className='flex items-center flex-col'>
                  {loading ? (
                    <>
                      <Avatar variant="rounded" className="bs-12 is-12 mbe-9">
                        <i className="tabler-loader animate-spin" />
                      </Avatar>
                      <Typography variant="h5" className="mbe-2.5">
                        Uploading and parsing Excel...
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
                        <i className='tabler-upload' />
                      </Avatar>
                      <Typography variant='h4' className='mbe-2.5'>
                        Drop excel file here or click to upload.
                      </Typography>
                      <Typography>Allowed *.xlsx</Typography>
                      <Typography>Only 1 file and max size of 2 MB</Typography>
                    </>
                  )}
                </div>
              </div>
            </AppReactDropzone>
          </Grid>

          {/* Show uploaded data table */}
          {uploadedData.length > 0 && !loading && (
            <>
              <Divider sx={{ my: 4 }} />
              <Grid size={{ xs: 12 }}>
                <Typography variant='h6' gutterBottom>Uploaded Data</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>State</TableCell>
                      <TableCell>Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {uploadedData.map((row, index) => (
                      <TableRow key={index}>
                        {/* Status Icon */}
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {isRowValid(index) ? (
                              <i className="tabler-check text-green-600" />
                            ) : (
                              <i className="tabler-x text-red-600" />
                            )}
                            <Typography variant="body2">{index + 1}</Typography>
                          </div>
                        </TableCell>

                        {/* State */}
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Typography>{row.state}</Typography>
                          </div>
                          {getError(index, 'state') && (
                            <FormHelperText error>{getError(index, 'state')}</FormHelperText>
                          )}
                        </TableCell>

                        {/* Location */}
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Typography>{row.location}</Typography>
                          </div>
                          {getError(index, 'location') && (
                            <FormHelperText error>{getError(index, 'location')}</FormHelperText>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default UploadLocationDialog;
