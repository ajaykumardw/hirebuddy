import { getServerSession } from 'next-auth'

// MUI Imports
import Button from '@mui/material/Button'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

// Component Imports
import Providers from '@components/Providers'
import Navigation from '@components/candidate-layout/vertical/Navigation'
import Header from '@components/candidate-layout/horizontal/Header'
import Navbar from '@components/candidate-layout/vertical/Navbar'
import VerticalFooter from '@components/candidate-layout/vertical/Footer'
import HorizontalFooter from '@components/candidate-layout/horizontal/Footer'
import Customizer from '@core/components/customizer'
import ScrollToTop from '@core/components/scroll-to-top'
import AuthGuard from '@/hocs/AuthGuard'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getDictionary } from '@/utils/getDictionary'
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import CandidateGuard from '@/hocs/CandidateGuard'
import { authOptions } from '@/libs/auth'

const Layout = async props => {
  const params = await props.params
  const { children } = props

  // Vars
  const direction = i18n.langDirection[params.lang]
  const dictionary = await getDictionary(params.lang)
  const mode = await getMode()
  const systemMode = await getSystemMode()
  const session = await getServerSession(authOptions)
  const userType = session?.user?.userType;

  return (
    <Providers direction={direction}>
      <AuthGuard locale={params.lang}>
        <CandidateGuard locale={params.lang}>
          <LayoutWrapper
            systemMode={systemMode}
            verticalLayout={
              <VerticalLayout
                navigation={<Navigation dictionary={dictionary} mode={mode} userType={userType} />}
                navbar={<Navbar />}
                footer={<VerticalFooter />}
              >
                {children}
              </VerticalLayout>
            }
            horizontalLayout={
              <HorizontalLayout header={<Header dictionary={dictionary} userType={userType} />} footer={<HorizontalFooter />}>
                {children}
              </HorizontalLayout>
            }
          />
          <ScrollToTop className='mui-fixed'>
            <Button
              variant='contained'
              className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
            >
              <i className='tabler-arrow-up' />
            </Button>
          </ScrollToTop>
          <Customizer dir={direction} />
        </CandidateGuard>
      </AuthGuard>
    </Providers>
  )
}

export default Layout
