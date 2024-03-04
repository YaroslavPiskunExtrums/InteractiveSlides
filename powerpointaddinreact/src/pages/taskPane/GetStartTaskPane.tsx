import LoadScreen from '@components/common/loadScreen/LoadScreen'
import { useProtectedRoute } from '@lib/hooks/useProtectedRoute'
import { TaskPaneRouterList } from '@lib/routes/routes.enum'
import { useRoute } from '@store/routing.store'

const GetStartTaskPane = () => {
  const { setHash } = useRoute()
  useProtectedRoute()

  return <LoadScreen onClick={() => setHash(TaskPaneRouterList.login.path)} />
}

export default GetStartTaskPane
