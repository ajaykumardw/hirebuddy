import { getServerSession } from 'next-auth'

// Component Imports
import HOList from '@views/admin/ho/list'

// Data Imports
// import { getUserData, getUserDataL } from '@/app/server/actions'

import { authOptions } from '@/libs/auth'

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/user-list` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */
const getUserData = async () => {
  // Vars
  try {
    // const token = await getCookie('token');

    const session = await getServerSession(authOptions);
    const token = session?.user?.token;

    if(token){

      // console.log("token", token);

      const res = await fetch(`${process.env.API_URL}/admin/ho`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await res.json();

      return data.data;
    } else{
      return [];
    }

  } catch (error) {
    console.error('Error fetching user data:', error);

    return [];
  }
}

const HOListApp = async () => {

  // Vars
  const userData = await getUserData()

  // console.log("userData", userData);

  return <HOList userData={userData} />
}

export default HOListApp
