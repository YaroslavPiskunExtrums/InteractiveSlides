import Loader from '@components/common/loader/Loader'
import Logo from '@components/common/logo/Logo'
import TaskPaneWrapper from '@components/taskPane/taskPaneWrapper/TaskPaneWrapper'
import SignUpForm from '@components/taskPane/signUpForm/SignUpForm'
import { useProtectedRoute } from '@lib/hooks/useProtectedRoute'
import { useState } from 'react'

const Registration = () => {
  const [isLoading, setIsLoading] = useState(false)
  useProtectedRoute()

  if (isLoading) {
    return <Loader />
  }

  return (
    <TaskPaneWrapper>
      <Logo />
      <SignUpForm setIsLoading={setIsLoading} />
    </TaskPaneWrapper>
  )
}

export default Registration
