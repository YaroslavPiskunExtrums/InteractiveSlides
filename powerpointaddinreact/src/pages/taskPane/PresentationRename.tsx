import Loader from '@components/common/loader/Loader'
import Logo from '@components/common/logo/Logo'
import LogOut from '@components/taskPane/logout/LogOut'
import PresentationRenameForm from '@components/taskPane/presentationRenameForm/PresentationRenameForm'
import TaskPaneWrapper from '@components/taskPane/taskPaneWrapper/TaskPaneWrapper'
import { useProtectedRoute } from '@lib/hooks/useProtectedRoute'
import { TaskPaneRouterList } from '@lib/routes/routes.enum'
import { useOffice } from '@store/office.store'
import { usePresentation } from '@store/presentation.store'
import { useRoute } from '@store/routing.store'
import { useEffect, useState } from 'react'

const PresentationRename = () => {
  useProtectedRoute()
  const { isOfficeReady } = useOffice()
  const { uploadLinkUrl } = usePresentation()
  const { setHash } = useRoute()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (uploadLinkUrl && isOfficeReady) {
      setHash(TaskPaneRouterList.preview.path)
    }
  }, [isOfficeReady, uploadLinkUrl, setHash])

  if (isLoading) {
    return <Loader />
  }

  return (
    <TaskPaneWrapper>
      <LogOut />
      <Logo />
      <PresentationRenameForm setIsLoading={setIsLoading} />
    </TaskPaneWrapper>
  )
}

export default PresentationRename
