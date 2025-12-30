// Next Imports
import { redirect } from 'next/navigation'

// Third-party Imports
import { getServerSession } from 'next-auth'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { getCookie } from '@/utils/cookies'

const GuestOnlyRoute = async ({ children, lang }) => {
  const session = await getCookie('token')

  if (session) {
    redirect(getLocalizedUrl('/dashboard', lang))
  }

  return <>{children}</>
}

export default GuestOnlyRoute
