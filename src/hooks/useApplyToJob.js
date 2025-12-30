import { useState } from 'react';

import { toast } from 'react-toastify';

export function useApplyToJob({ token, jobId, applied, setApplied, handleClose }) {
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!token || !jobId || applied) return;

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/jobs/${jobId}/apply`, {
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
        setApplied(true);
        toast.success(data?.message || 'Applied successfully', {
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
      setLoading(false);
    }
  };

  return { handleApply, loading };
}
