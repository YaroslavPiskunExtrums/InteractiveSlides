import { ReactNode } from 'react'
import classes from './taskPaneWrapper.module.scss'

interface IProps {
  children: ReactNode
  itemPadding?: string
}

const TaskPaneWrapper = ({ children, itemPadding = '1.5rem' }: IProps) => {
  return (
    <div className={classes.taskPaneWrapper} style={{ padding: itemPadding }}>
      {children}
    </div>
  )
}

export default TaskPaneWrapper
