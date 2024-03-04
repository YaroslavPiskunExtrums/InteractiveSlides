import Loader from '@components/common/loader/Loader'
import Logo from '@components/common/logo/Logo'
import Clipboard from '@components/taskPane/clipboard/Clipboard'
import LogOut from '@components/taskPane/logout/LogOut'
import SubmitPresentationForm from '@components/taskPane/submitPresentationForm/SubmitPresentationForm'
import TaskPaneWrapper from '@components/taskPane/taskPaneWrapper/TaskPaneWrapper'
import { useProtectedRoute } from '@lib/hooks/useProtectedRoute'
import { usePresentation } from '@store/presentation.store'
import { useState } from 'react'

const SubmitPresentation = () => {
  useProtectedRoute()
  const { uploadLinkUrl } = usePresentation()
  const [isLoading, setIsLoading] = useState(false)

  if (isLoading) {
    return <Loader />
  }

  return (
    <TaskPaneWrapper itemPadding="0rem">
      <LogOut />
      <Logo marginBottom="0rem" />
      <p className="text-sm mb-2">To submit the presentation click the button below</p>
      <SubmitPresentationForm setIsLoading={setIsLoading} />
      {uploadLinkUrl ? <Clipboard /> : <></>}
    </TaskPaneWrapper>
  )
}

export default SubmitPresentation
