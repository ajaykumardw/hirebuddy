import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import classNames from "classnames";

import { authOptions } from "@/libs/auth";

import JobView from "@/views/user/jobs/view/JobView";

import frontCommonStyles from '../styles.module.css'
import InviteJobViewPage from "@/views/InviteJobViewPage";

export const metadata = {
  title: 'Job Invite',
  description: 'Placement'
}

const fetchData = async (id) => {

  const session = await getServerSession(authOptions);
  const token = session?.user?.token;
  const isCandidate = !session || session?.user?.userType === 'candidate';

  try {


    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/apply/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const data = await res.json();

    if (!res.ok) {

      redirect('/not-found')

    }

    return {...data, isCandidate};

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

  // console.log('invite view:', data);

  if (!data?.job) {
    redirect('/not-found')
  }

  return (
    <InviteJobViewPage data={data} id={id} />
  )

  // return (
  //   <section className={classNames('md:plb-[100px] plb-6', frontCommonStyles.layoutSpacing)}>
  //     <JobView job={data?.job} isCandidate={data?.isCandidate} jobUuid={id} />
  //   </section>
  // )

}

export default ViewJobPage
