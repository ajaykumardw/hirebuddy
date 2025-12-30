import { useState } from 'react';

import { toast } from 'react-toastify';

export function useSaveToJob({ token, jobId, applied, saved, setSaved, handleClose }) {
  const [saveLoading, setSaveLoading] = useState(false);

  const handleSave = async () => {
    if (!token || !jobId || saved || applied) return;

    setSaveLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/jobs/${jobId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || 'Application failed', {
          autoClose: 10000,
          hideProgressBar: false,
        });
      } else {
        setSaved(true);
        toast.success(data?.message || 'Saved successfully', {
          autoClose: 10000,
          hideProgressBar: false,
        });
      }

    } catch (error) {
      console.error('error:', error);
      toast.error('Something went wrong.', {
        autoClose: 10000,
        hideProgressBar: false,
      });
    } finally {
      handleClose()
      setSaveLoading(false);
    }
  };

  return { handleSave, saveLoading };
}
