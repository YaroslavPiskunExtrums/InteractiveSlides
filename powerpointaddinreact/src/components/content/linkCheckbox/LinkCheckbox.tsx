import { ChangeEvent } from 'react'
import classes from './linkCheckbox.module.scss'

interface IProps {
  value: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const LinkCheckbox = ({ value, onChange }: IProps) => {
  return (
    <label htmlFor="is-link" className={classes.isLinkContainer}>
      <input
        type="checkbox"
        id="is-link"
        className={classes.isLink}
        checked={value}
        onChange={onChange}
      />
      <span>Is link</span>
    </label>
  )
}

export default LinkCheckbox
