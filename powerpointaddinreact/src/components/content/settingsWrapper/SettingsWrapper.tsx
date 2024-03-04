import { ReactNode, useEffect } from 'react'
import classes from './settingsWrapper.module.scss'
import { saveDefaultStyles } from '@lib/utils/defaultStyles'
import { saveDefaultLabelList } from '@lib/utils/saveLabelToList'
import { checkAndCreateShapeName } from '@lib/utils/addin'

const SettingsWrapper = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    checkAndCreateShapeName()
    saveDefaultLabelList()
    saveDefaultStyles()
  }, [])

  return (
    <main className={classes.mainWrapper}>
      <div className={classes.mainContainer}>
        <div className={classes.scrollContainer}>
          <div className={classes.headerElement}>
            <span className={classes.headerText}>Basic elements</span>
          </div>
          {children}
        </div>
      </div>
    </main>
  )
}

export default SettingsWrapper
