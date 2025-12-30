'use client'

import { useState } from "react";

import { toast } from "react-toastify";

import { useSession } from "next-auth/react";

import { Card, CardContent, CardHeader, Divider, Switch } from "@mui/material"

const AlertTemplateData = ({template}) => {

  const [templateData, setTemplateData] = useState(template);
  const {data: session} = useSession();
  const token = session?.user?.token;

  const handleStatusChange = async (newStatus) => {

    if(!token) return

    // For example, updating local state:
    setTemplateData((prev) => ({
      ...prev,
      status: newStatus ? 1 : 0
    }));

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job-email-templates/${templateData?.id}/status`, {
      method: 'put',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await res.json();

    if(res.ok){

      toast.success(data?.message || 'Status Changed', {
        autoClose: 10000,
        hideProgressBar: false,
      });

    } else {
      toast.success(data?.message || 'Status Not Changed', {
        autoClose: 10000,
        hideProgressBar: false,
      });
    }

  };

  return (
    <Card>
      <CardHeader title={templateData?.template_name} action={<Switch color='success' checked={!!templateData?.status} onChange={(e) => handleStatusChange(e.target.checked)} />} />
      <Divider />
      <CardContent>
        <div dangerouslySetInnerHTML={{ __html: templateData?.body }} />
      </CardContent>
    </Card>
  )
}

export default AlertTemplateData
