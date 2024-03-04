import { ChangeEvent } from 'react'
import classes from './settingSelect.module.scss'
interface IProps {
  selectId: string
  options: { value: string | number; label: string; id: number }[]
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  value: string | number
  label?: string
  marginBottom?: string
  smallLabel?: boolean
}

const SettingSelect = ({
  onChange,
  selectId,
  options,
  value,
  label = '',
  marginBottom = '1rem',
  smallLabel = false,
}: IProps) => {
  return (
    <div className={classes.selectWrapper} style={{ marginBottom: marginBottom }}>
      <label
        htmlFor={selectId}
        className={smallLabel ? classes.smallSelectLabel : classes.selectLabel}
      >
        {label}
      </label>
      <select id={selectId} onChange={onChange} value={value} className={classes.select}>
        {options.map(({ id, label, value }) => (
          <option value={value} key={id}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SettingSelect
