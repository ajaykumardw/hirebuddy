import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "@/libs/auth";

import FormAddEditJob from "@/views/user/jobs/add/FormAddEditJob";

import { getLocalizedUrl } from "@/utils/i18n";

import JobView from "@/views/user/jobs/view/JobView";

const fetchData = async (id, lang) => {

  const session = await getServerSession(authOptions);
  const token = session?.user?.token;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}/view`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    cache: "no-store",
  })

  const data = await res.json();

  console.log("api data", data);

  if (!res.ok) {

    redirect(getLocalizedUrl('/jobs/list', lang));
  }

  return data;

}

const ViewJobPage = async (props) => {
  const params = await props.params;
  const lang = params.lang;
  const id = params.id
  const data = await fetchData(id, lang);

  // console.log("data:", data);

  return <JobView jobData={data?.job} />

}

export default ViewJobPage
