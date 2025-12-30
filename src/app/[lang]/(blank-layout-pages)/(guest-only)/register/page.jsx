// Component Imports
import CandidateRegister from '@/views/CandidateRegister'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Register',
  description: 'Register to your account'
}

const RegisterPage = async () => {
  // Vars
  const mode = await getServerMode()

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] p-6'>
      <CandidateRegister mode={mode} />
    </div>
  )
}

export default RegisterPage
