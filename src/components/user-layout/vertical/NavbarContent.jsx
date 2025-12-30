// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavToggle from './NavToggle'
import ModeDropdown from '@components/user-layout/shared/ModeDropdown'
import UserDropdown from '@components/user-layout/shared/UserDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import WelcomeUser from '@components/user-layout/shared/WelcomeUser'

const NavbarContent = () => {
  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
        <WelcomeUser />
      </div>
      <div className='flex items-center'>
        <ModeDropdown />
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
