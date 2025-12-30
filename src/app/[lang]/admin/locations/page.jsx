import { getServerSession } from "next-auth";

import { authOptions } from "@/libs/auth";

import LocationList from "@/views/head-office/locations/list";

const getLocationData = async () => {
  // Vars
  try {
    // const token = await getCookie('token');

    const session = await getServerSession(authOptions);
    const token = session?.user?.token;

    if(token){

      const res = await fetch(`${process.env.API_URL}/states`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if(res.ok){

        const data = await res.json();

        return data;
      } else {

        return [];
      }

    } else{
      return [];
    }

  } catch (error) {
    console.error('Error fetching user data:', error);

    return [];
  }
}

const ListPage = async () => {

  const data = await getLocationData()

  console.log("data:", data);

  return (
    <LocationList locationData={data.locations} stateData={data?.states || []} isAdmin={true} />
  )
}

export default ListPage
