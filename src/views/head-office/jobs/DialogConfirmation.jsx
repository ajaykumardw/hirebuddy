// React Imports

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { CircularProgress } from '@mui/material'

import { useApplyToJob } from '@/hooks/useApplyToJob'
import { useSaveToJob } from '@/hooks/useSaveToJob'

const DialogsConfirmation = ({ isSave, open, token, jobId, applied, setApplied, saved, setSaved, handleClose }) => {

  const { handleApply, loading } = useApplyToJob({ token, jobId, applied, setApplied, handleClose });
  const { handleSave, saveLoading } = useSaveToJob({ token, jobId, applied, saved, setSaved, handleClose });

  return (
    <>
      {/* <Button variant='outlined' onClick={handleClickOpen}>
        Open dialog
      </Button> */}
      <Dialog
        open={open}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
        closeAfterTransition={false}
      >
        <DialogTitle id='alert-dialog-title'>Are your sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Do you want to {isSave ? 'save' : 'apply'} this job.
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button color='error' variant='outlined' onClick={handleClose}>Cancel</Button>
          {isSave ?
            <Button color='primary' variant='contained' className='gap-2' onClick={handleSave} disabled={saveLoading || saved || applied}>
              {saveLoading ? <><CircularProgress size={20} color='inherit' />Saving...</> : 'Save'}
            </Button>
           :
            <Button color='primary' variant='contained' className='gap-2' onClick={handleApply} disabled={loading || applied}>
              {loading ? <><CircularProgress size={20} color='inherit' />Applying...</> : 'Apply'}
            </Button>
          }
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DialogsConfirmation
