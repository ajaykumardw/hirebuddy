import { getServerSession } from 'next-auth'

// Component Imports
import CandidatesList from '@/views/user/candidates/list'

// Data Imports

// import { getcandidatesData, getcandidatesDataL } from '@/app/server/actions'
import { getCookie } from '@/utils/cookies'

import { authOptions } from '@/libs/auth'

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/user-list` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */
// const getCandidatesData = async () => {
//   // Vars
//   try {
//     // const token = await getCookie('token');

//     const session = await getServerSession(authOptions);
//     const token = session?.user?.token;

//     if(token){

//       const res = await fetch(`${process.env.API_URL}/candidates`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       })

//       const data = await res.json();

//       return data;
//     } else{
//       return [];
//     }

//   } catch (error) {
//     console.error('Error fetching user data:', error);

//     return [];
//   }
// }

const CandidatesPage = async () => {

  // Vars
  // const candidatesData = await getCandidatesData()

  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  return <CandidatesList token={token} />
}

export default CandidatesPage
