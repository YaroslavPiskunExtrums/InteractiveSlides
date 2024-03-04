import { ReactNode } from 'react'
import classes from './settingContainer.module.scss'
import { useRoute } from '@store/routing.store'
import { ContentRoutesList } from '@lib/routes/routes.enum'

interface IProps {
  settingsTitle: string
  children: ReactNode
}

const SettingContainer = (props: IProps) => {
  const { setHash } = useRoute()

  return (
    <div className={classes.figureSettingContainer}>
      <a onClick={() => setHash(ContentRoutesList.figureList.path)} className={classes.backLink}>
        <span className={classes.backLinkIcon}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M16 7H3.83L9.42 1.41L8 0L0 8L8 16L9.41 14.59L3.83 9H16V7Z" fill="#323232" />
          </svg>
        </span>
        <span className={classes.backLinkText}>Back</span>
      </a>
      <div className={classes.settings}>
        <h3 className={classes.settingsTitle}>{props.settingsTitle}</h3>
        {props.children}
      </div>
    </div>
  )
}

export default SettingContainer
