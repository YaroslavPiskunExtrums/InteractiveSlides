import { FC, MouseEvent, ReactNode } from 'react'
import './button.sass'

interface IProps {
  children: ReactNode
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}

const Button: FC<IProps> = (props) => {
  return (
    <button className="button" onClick={props.onClick}>
      {props.children}
    </button>
  )
}

export default Button
