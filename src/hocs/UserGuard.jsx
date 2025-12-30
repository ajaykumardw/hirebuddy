import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth';

import { authOptions } from '@/libs/auth';

// Third-party Imports

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'
import { getLocalizedUrl } from '@/utils/i18n';

export default async function UserGuard({ children, locale }) {
  const session = await getServerSession(authOptions)
  const userType = session.user.userType;

  if(userType === 'A') {
    redirect(getLocalizedUrl(`/admin/dashboard`, locale));
  } else if(userType === 'HO') {
    redirect(getLocalizedUrl(`/head-office/dashboard`, locale));
  } else if(userType === 'B') {
    redirect(getLocalizedUrl(`/branch/dashboard`, locale));
  } else if(userType === 'candidate' ) {
    redirect(getLocalizedUrl(`/candidate/dashboard`, locale));
  } else if(userType !== 'U') {
    redirect(getLocalizedUrl(`/not-authorized`, locale));
  }
  
  return <>{session ? children : <AuthRedirect lang={locale} />}</>
}
