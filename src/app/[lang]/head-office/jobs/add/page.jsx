import { getServerSession } from "next-auth"

import { authOptions } from "@/libs/auth";

import FormAddEditJob from "@/views/head-office/jobs/add/FormAddEditJob"

const fetchData = async () => {
  try {

    const session = await getServerSession(authOptions);
    const token = session?.user?.token;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/create`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json();

    return data;

  } catch (error) {
    console.error('Error fetching data:', error);

    return null;
  }
}

const AddPage = async () => {

  const data = await fetchData();

  // console.log("stateData", stateData);

  return <FormAddEditJob branchData={data?.branches} skillsData={data?.skills} industries={data?.industries} departments={data?.departments} locations={data?.locations}/>
}

export default AddPage
