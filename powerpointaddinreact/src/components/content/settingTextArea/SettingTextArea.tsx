import { ChangeEvent } from 'react'
import classes from './settingTestArea.module.scss'

interface IProps {
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
}

const SettingTextArea = ({ onChange, value, placeholder = '' }: IProps) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      className={classes.textAreaElement}
      placeholder={placeholder}
    />
  )
}

export default SettingTextArea
