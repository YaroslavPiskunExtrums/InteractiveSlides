import React from 'react'
import { FigureOpenFieldProps } from '../../../../../types/figures-config.props'

type DropdownSelectProps = {
  options: { id:string, value: string }[],
  onChange: (value: React.ChangeEvent<HTMLSelectElement>) => void,
  defaultValue?: string
  className?: string


  inputConfig?: FigureOpenFieldProps['config']['inputConfig']
}
const DropdownSelect = ({ options, onChange, defaultValue = options[0].id, className = '' }: DropdownSelectProps) => {
  return <select onChange={e => onChange(e)}
                 className={`customer-details_business-select ${className}`} defaultValue={defaultValue}>
    {options.map((option, index) => <option key={index} value={option.id}>{option.value}</option>)}
  </select>
}

export default DropdownSelect