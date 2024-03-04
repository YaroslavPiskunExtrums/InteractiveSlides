import { logOutAndNavigate } from '@lib/utils/logOutAndNavigate'
import LogoutSvg from '@assets/LogoutSvg'
import classes from './logOut.module.scss'

const LogOut = () => {
  const onLogoutHandler = () => {
    logOutAndNavigate()
  }
  return (
    <button onClick={onLogoutHandler} className={classes.logOutBtn}>
      <LogoutSvg />
      <span>Logout</span>
    </button>
  )
}

export default LogOut
