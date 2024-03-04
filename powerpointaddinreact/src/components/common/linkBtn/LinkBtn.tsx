import { MouseEvent, ReactNode } from 'react'
import classes from './linkBtn.module.scss'
import classNames from '@lib/utils/classNames'

interface IProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
  children?: ReactNode
  className?: string
}
const LinkBtn = ({ onClick, children = '', className }: IProps) => {
  return (
    <button className={classNames(classes.linkBtn, className ? className : '')} onClick={onClick}>
      {children}
    </button>
  )
}

export default LinkBtn
