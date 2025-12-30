import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/libs/auth";

import FormAddEditJob from "@/views/user/jobs/add/FormAddEditJob";

import { getLocalizedUrl } from "@/utils/i18n";

import JobView from "@/views/user/jobs/view/JobView";

const fetchData = async (id, lang) => {

  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  try {


    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/jobs/${id}/view`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json();

    if (!res.ok) {

      redirect(getLocalizedUrl('/candidate/jobs/list', lang));
    }

    return data;

  } catch (error) {
    console.log("error:", error)

    return [];
  }

}

const ViewJobPage = async (props) => {
  const params = await props.params;
  const lang = params.lang;
  const id = params.id
  const data = await fetchData(id, lang);

  return <JobView jobData={data?.job} isCandidate={true} />

  // return <FormAddEditJob jobId={id} skillsData={data?.skills} industries={data?.industries} departments={data?.departments} jobData={data?.job} locations={data?.locations}/>
}

export default ViewJobPage
