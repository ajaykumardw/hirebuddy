import { getServerSession } from "next-auth";

import { authOptions } from "@/libs/auth";

import AlertTemplateList from "@/views/email-templates/alert-templates";

const getJobsData = async () => {
  // Vars
  try {
    // const token = await getCookie('token');

    const session = await getServerSession(authOptions);
    const token = session?.user?.token;

    if(token){

      const res = await fetch(`${process.env.API_URL}/job-email-templates`, {
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
    console.error('Error fetching template data:', error);

    return [];
  }
}

const JobEmailTemplatePage = async () => {

  const jobsData = await getJobsData()

  return (
    <AlertTemplateList templates={jobsData?.templates} />
  )

}

export default JobEmailTemplatePage
