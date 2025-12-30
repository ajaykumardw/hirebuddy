import { getServerSession } from "next-auth";

import { authOptions } from "@/libs/auth";

import JobsList from "@/views/user/jobs/list"
import JobAppliedSuccess from "../../../../../views/JobAppliedSuccess";

const AppliedJobSuccessPage = async () => {

  // console.log("json data of jobs", jobsData);

  return (
    <JobAppliedSuccess />
  )
}

export default AppliedJobSuccessPage
