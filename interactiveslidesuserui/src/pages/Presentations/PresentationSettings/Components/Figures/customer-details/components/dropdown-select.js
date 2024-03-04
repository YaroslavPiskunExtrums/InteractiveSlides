import React from 'react'


const DropdownSelect = ({ options, onChange, defaultValue = options[0].id, className = '' }) => {
  return <select onChange={e => onChange(e)}
                 className={`customer-details_business-select ${className}`} defaultValue={defaultValue}>
    {options.map((option, index) => <option key={index} value={option.id}>{option.value}</option>)}
  </select>
}

export default DropdownSelect