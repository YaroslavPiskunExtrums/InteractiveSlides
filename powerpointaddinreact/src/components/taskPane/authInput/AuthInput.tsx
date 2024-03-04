import classNames from '@lib/utils/classNames'
import { ChangeEvent } from 'react'
import classes from './authInput.module.scss'

interface IProps {
  type?: string
  className?: string
  id?: string
  placeholder?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const AuthInput = ({ type = 'text', className, id, placeholder, onChange, value }: IProps) => {
  return (
    <input
      value={value}
      onChange={onChange}
      type={type}
      className={classNames(classes.input, className ? className : '')}
      id={id}
      placeholder={placeholder}
    />
  )
}

export default AuthInput
