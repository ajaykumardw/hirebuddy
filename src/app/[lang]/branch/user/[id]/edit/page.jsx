// MUI Imports
import Grid from '@mui/material/Grid2'

import { getServerSession } from 'next-auth';

import { authOptions } from '@/libs/auth';

// Component Imports
import FormUserAdd from '@/views/branch/user/add/FormUserAdd'


// const getData = async () => {

//   try {

//     const session = await getServerSession(authOptions);
//     const token = session?.user?.token;

//     if(token){

//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/states`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       const data = await response.json();

//       return data.states;
//     } else{
//       return [];
//     }

//   } catch (error) {
//     console.error('Error fetching user data:', error);

//     return [];
//   }

// }

const getData = async () => {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.user?.token;

    // console.log("token:", token);

    if (!token) return { states: [], departments: [], reportingManagers: [] };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // Run both fetches in parallel
    const [statesRes, departRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/states`, { method: 'GET', headers }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/users/add`, { method: 'GET', headers }),
    ]);

    const [statesData, allData] = await Promise.all([
      statesRes.json(),
      departRes.json(),
    ]);

    return {
      states: statesData.states || [],
      departments: allData?.departments || [],
      reportingManagers: allData?.reportingManagers || []
    };
  } catch (error) {
    console.error('Error fetching data:', error);

    return { states: [], departments: [], reportingManagers: [] };
  }
};

const EditUser = async () => {

  // const data = await getData();

  const { states, departments, reportingManagers } = await getData();

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <FormUserAdd statesData={states} departments={departments} reportingManagers={reportingManagers} />
      </Grid>
    </Grid>
  )
}

export default EditUser
