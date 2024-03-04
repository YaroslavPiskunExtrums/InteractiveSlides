import { TaskPaneRouterList } from '@lib/routes/routes.enum'
import { removeFromLocalStorage } from './localStorage'

export const logOutAndNavigate = () => {
  removeFromLocalStorage('slides-tokens')
  removeFromLocalStorage('default_styles')
  window.location.hash = TaskPaneRouterList.login.path
}
