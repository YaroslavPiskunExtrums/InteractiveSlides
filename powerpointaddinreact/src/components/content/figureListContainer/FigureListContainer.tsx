import { ReactNode } from 'react'
import classes from './figureListContainer.module.scss'

const FigureListContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className={classes.settingContainer}>
      <div className={classes.settingsHeader}>Add element</div>
      {children}
    </div>
  )
}

export default FigureListContainer
