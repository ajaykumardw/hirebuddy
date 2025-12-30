import { getServerSession } from 'next-auth';

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import FormUserAdd from '@/views/apps/user/add/FormUserAdd'

import FormHOAdd from '@/views/admin/ho/add/FormHOAdd';

import { authOptions } from '@/libs/auth';

const getData = async () => {

  try {

    const session = await getServerSession(authOptions);
    const token = session?.user?.token;

    if(token){

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/states`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      return data.states;
    } else{
      return [];
    }

  } catch (error) {
    console.error('Error fetching user data:', error);

    return [];
  }

}

const EditBranch = async (props) => {

  const params = await props.params;
  const hoId = params.id

  const data = await getData();

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <FormHOAdd statesData={data || []} hoId={hoId} />
        {/* <FormUserAdd /> */}
      </Grid>
    </Grid>
  )
}

export default EditBranch
