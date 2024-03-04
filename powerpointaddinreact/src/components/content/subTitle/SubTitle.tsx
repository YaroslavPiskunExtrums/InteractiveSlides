import { ReactNode } from 'react'
import classes from './subTitle.module.scss'

const SubTitle = ({ children, marginBottom }: { children: ReactNode; marginBottom?: string }) => {
  return (
    <div className={classes.subTitle} style={{ marginBottom }}>
      {children}
    </div>
  )
}

export default SubTitle
