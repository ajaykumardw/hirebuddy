import { Card } from "@mui/material"

import AddCandidateForm from "@/views/user/candidates/add/AddCandidateForm"

const AddPage = async () => {
  return (
    <Card className='overflow-visible'>
      <AddCandidateForm />
    </Card>
  )
}

export default AddPage
