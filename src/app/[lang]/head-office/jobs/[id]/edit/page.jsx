import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/libs/auth";

import FormAddEditJob from "@/views/head-office/jobs/add/FormAddEditJob";

import { getLocalizedUrl } from "@/utils/i18n";

const fetchData = async (id, lang) => {

  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  try {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/edit`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })


    const data = await res.json();

    if (!res.ok) {

      console.log("edit job data:", data)

      redirect(getLocalizedUrl('/head-office/jobs/list', lang));
    }

    return data;
  } catch (error) {
    console.log("error:", error)
    redirect(getLocalizedUrl('/head-office/jobs/list', lang));
  }

}

const EditJobPage = async (props) => {
  const params = await props.params;
  const lang = params.lang;
  const id = params.id
  const data = await fetchData(id, lang);

  return <FormAddEditJob branchData={data?.branches} jobId={id} skillsData={data?.skills} industries={data?.industries} departments={data?.departments} jobData={data?.job} locations={data?.locations}/>
}

export default EditJobPage
