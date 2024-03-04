import { ChangeEvent, useEffect, useState } from 'react'
import SettingInput from '../settingInput/SettingInput'
import { getLabelOptionsFromOffice } from '@lib/utils/addin'
import { defaultLabels } from '@lib/constants/figures.constants'

interface IProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const Label = ({ onChange, value }: IProps) => {
  const [labels, setLabels] = useState<string[]>([])
  useEffect(() => {
    const labelOptions = getLabelOptionsFromOffice()

    if (labelOptions) {
      setLabels(labelOptions)
      return
    }
    setLabels(defaultLabels)
  }, [])
  return (
    <fieldset className="labels-select">
      <SettingInput
        onChange={onChange}
        placeholder="Select your fav browser"
        value={value}
        role="combobox"
        list="labels-list"
      />
      <datalist id="labels-list" className="labelsList">
        {labels.map((label, i) => (
          <option value={label} key={i}>
            {label}
          </option>
        ))}
      </datalist>
    </fieldset>
  )
}

export default Label
