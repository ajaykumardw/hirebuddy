'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { toast } from 'react-toastify'

// Icon Imports
import { useDropzone } from 'react-dropzone'

import { useSession } from 'next-auth/react'

import { Card, CardContent } from '@mui/material'

import AppReactDropzone from '@/libs/styles/AppReactDropzone'

import AddCandidateForm from '../add/AddCandidateForm'

const UploadCandidate = () => {
  // States
  const [files, setFiles] = useState([])
  const [uploadedData, setUploadedData] = useState();

  const { data: session } = useSession();
  const token = session?.user?.token;

  const [isLoadingFile, setLoadingFile] = useState(false);

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: 2000000, // 2 MB
    accept: {
      'application/pdf': ['.pdf']
    },
    onDrop: async (acceptedFiles) => {

      setLoadingFile(true)

      const formData = new FormData();

      formData.append('file', acceptedFiles[0])

      if(acceptedFiles){
        try {

          const resCV = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parse-cv`, {
            method: 'post',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData,
          });

          if(!resCV.ok){
            console.error('CV error:', resCV.statusText);
            throw new Error('CV parsing failed: ', resCV.statusText);
          }


          const data = await resCV.json();

          if(data[0]){

            const workStatus = data[0]?.experience ? 'experienced' : 'fresher';

            setFiles(acceptedFiles.map(file => Object.assign(file)))
            setUploadedData(data[0]);

            // console.log('Upload successful:', data[0]);

            setLoadingFile(false);
          } else {
            toast.error('Upload failed. Can not extract data from file.', { autoClose: 10000, hideProgressBar: false });

            setLoadingFile(false);
          }

        } catch (error) {
          console.error('Upload error:', error);
          toast.error('Upload failed. Please try again.', { autoClose: 10000, hideProgressBar: false });
          setFiles([])
          setUploadedData([])
          setLoadingFile(false);
        }
      }

    },
    onDropRejected: () => {
      toast.error('Only one PDF file is allowed, and the size must be under 2 MB.', {
        autoClose: 10000,
        hideProgressBar: false,
      })
    }
  });

  const renderFilePreview = file => {
    if (file.type === 'application/pdf') {

      return <i className='tabler-file-type-pdf' style={{ fontSize: 38 }} />
    } else {

      return <i className='tabler-alert-circle' style={{ fontSize: 38, color: 'red' }} />
    }
  }


  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)

    setFiles([...filtered])
  }

  const fileList = files.map(file => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='tabler-x text-xl' />
      </IconButton>
    </ListItem>
  ))

  const candidateForm = () => {
    return (<>
      <Card className='overflow-visible mt-5' variant='outlined'>
        <AddCandidateForm candiData={uploadedData} />
      </Card>
      </>
    )
  }

  return (
    <Card>
      <CardContent>
        <AppReactDropzone>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className='flex items-center flex-col'>
              {isLoadingFile ? (<>
              <Avatar variant="rounded" className="bs-12 is-12 mbe-9">
                <i className="tabler-loader animate-spin" />
              </Avatar>
              <Typography variant="h5" className="mbe-2.5">
                Uploading and parsing CV...
              </Typography>
              </>) : (<>
              <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
                <i className='tabler-upload' />
              </Avatar>
              <Typography variant='h4' className='mbe-2.5'>
                Drop files here or click to upload.
              </Typography>
              <Typography>Allowed *.pdf</Typography>
              <Typography>Only 1 file and max size of 2 MB</Typography>
              </>
              )}
            </div>
          </div>
          {!isLoadingFile && files.length ? (
            <>
              <List>{fileList}</List>
              {candidateForm()}
            </>
          ) : null}
        </AppReactDropzone>
      </CardContent>
    </Card>
  )
}

export default UploadCandidate
