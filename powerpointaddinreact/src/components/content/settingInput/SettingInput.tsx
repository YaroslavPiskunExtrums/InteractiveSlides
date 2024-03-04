import { ChangeEvent, HTMLInputTypeAttribute } from 'react'
import classes from './settingInput.module.scss'
import classNames from '@lib/utils/classNames'
import { UseFormRegister } from 'react-hook-form'

interface IProps {
  label?: { text: string; id: string }
  labelDisplay?: string
  labelWidth?: string
  type?: HTMLInputTypeAttribute
  value?: string | number
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  marginBottom?: string
  placeholder?: string
  role?: string
  list?: string
  registerData?: { register: UseFormRegister<any>; name: string }
}

const SettingInput = ({
  label,
  labelDisplay = 'block',
  labelWidth = '100%',
  type = 'text',
  onChange,
  value,
  marginBottom = '1rem',
  placeholder = '',
  role,
  list,
  registerData,
}: IProps) => {
  const input = registerData ? (
    <input
      {...registerData?.register(registerData.name)}
      type={type}
      id={label?.id}
      placeholder={placeholder}
      style={{ marginBottom: marginBottom }}
      className={classNames(classes.labelInput, classes.input)}
    />
  ) : (
    <input
      type={type}
      id={label?.id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ marginBottom: marginBottom }}
      className={classNames(classes.labelInput, classes.input)}
    />
  )

  return label ? (
    <label
      htmlFor={label.id}
      className={classes.label}
      style={{ display: labelDisplay, width: labelWidth }}
    >
      <span>{label.text}</span>
      {type !== 'color' ? (
        input
      ) : (
        <ColorInput id={label.id} onChange={onChange} value={value} marginBottom={marginBottom} />
      )}
    </label>
  ) : (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      role={role ?? 'text'}
      list={list ?? ''}
      className={classes.input}
      style={{ marginBottom: marginBottom }}
    />
  )
}

interface IColorInputProps {
  marginBottom: string
  id: string
  value?: string | number
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const ColorInput = ({ marginBottom, id, value, onChange }: IColorInputProps) => {
  return (
    <div className={classes.colorInputWrapper} style={{ marginBottom: marginBottom }}>
      <input
        id={id}
        type="color"
        value={value}
        onChange={onChange}
        className={classes.colorInput}
      />
      <div className={classes.colorInputValue}>
        <span className={classes.colorInputValueText}>HEX</span>
        <input
          type="text"
          className={classes.colorInputValueInput}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default SettingInput
