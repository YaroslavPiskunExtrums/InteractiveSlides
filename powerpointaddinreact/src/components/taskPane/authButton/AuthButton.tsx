import classNames from '@lib/utils/classNames'
import { MouseEvent } from 'react'
import classes from './authButton.module.scss'

interface IProps {
  className?: string
  children?: React.ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  type?: 'submit' | 'reset' | 'button'
}

const AuthButton = ({ children, className, onClick = () => {}, type = 'button' }: IProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames(classes.btn, 'bg-[rgb(192,192,192)]', className ? className : '')}
    >
      {children}
    </button>
  )
}

export default AuthButton
