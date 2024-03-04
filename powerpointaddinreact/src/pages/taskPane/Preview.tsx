import LinkBtn from '@components/common/linkBtn/LinkBtn'
import Logo from '@components/common/logo/Logo'
import Clipboard from '@components/taskPane/clipboard/Clipboard'
import LogOut from '@components/taskPane/logout/LogOut'
import TaskPaneWrapper from '@components/taskPane/taskPaneWrapper/TaskPaneWrapper'
import { useProtectedRoute } from '@lib/hooks/useProtectedRoute'
import { TaskPaneRouterList } from '@lib/routes/routes.enum'
import { useRoute } from '@store/routing.store'

const Preview = () => {
  useProtectedRoute()
  const { setHash } = useRoute()

  const onClickHandler = () => {
    setHash(TaskPaneRouterList.submitPresentation.path)
  }

  return (
    <TaskPaneWrapper itemPadding="0rem">
      <LogOut />
      <Logo marginBottom="0rem" />
      <p className="text-sm mb-2">To submit the presentation click the button below</p>
      <LinkBtn onClick={onClickHandler} className="text-base mt-0 bg-[#FF5630] py-[0.375rem] px-3">
        Update Presentation
      </LinkBtn>
      <Clipboard />
    </TaskPaneWrapper>
  )
}

export default Preview
