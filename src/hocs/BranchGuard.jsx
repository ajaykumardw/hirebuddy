import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth'

// Third-party Imports
import { authOptions } from '@/libs/auth';

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'


export default async function BranchGuard({ children, locale }) {
  const session = await getServerSession(authOptions)
  const userType = session.user.userType;

  // console.log('session', session);

  if(userType !== 'B') {
    redirect(`/not-authorized`);
  }

  return <>{session ? children : <AuthRedirect lang={locale} />}</>
}
