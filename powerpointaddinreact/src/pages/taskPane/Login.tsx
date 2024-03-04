import Loader from '@components/common/loader/Loader'
import Logo from '@components/common/logo/Logo'
import TaskPaneWrapper from '@components/taskPane/taskPaneWrapper/TaskPaneWrapper'
import SignInForm from '@components/taskPane/signInForm/SignInForm'
import { useProtectedRoute } from '@lib/hooks/useProtectedRoute'
import { useState } from 'react'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  useProtectedRoute()

  if (isLoading) {
    return <Loader />
  }

  return (
    <TaskPaneWrapper>
      <Logo />
      <SignInForm setIsLoading={setIsLoading} />
    </TaskPaneWrapper>
  )
}

export default Login
