'use client'

import { useState } from "react";

import { redirect } from "next/navigation";

import classNames from "classnames";

import frontCommonStyles from '../app/jobs/styles.module.css'

import JobView from "@/views/user/jobs/view/JobView";

const InviteJobViewPage = ({ data, id }) => {

  const [appliedSuccess, setAppliedSuccess] = useState(false);

  if(appliedSuccess){

    redirect('/candidate/jobs/applied-success')

  }

  return (
    <section className={classNames('plb-6', frontCommonStyles.layoutSpacing)}>
      <JobView jobData={data?.job} isCandidate={data?.isCandidate} jobUuid={id} setAppliedSuccess={setAppliedSuccess} registered={data?.registered} isInvite={true} />
    </section>
  )

}

export default InviteJobViewPage
