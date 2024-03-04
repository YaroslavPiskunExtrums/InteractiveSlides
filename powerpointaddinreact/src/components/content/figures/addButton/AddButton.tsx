import { AddButtonSettingsType } from '@/types/figures/addButton.types'
import { CSSProperties } from 'react'
import classes from './addButton.module.scss'

interface IProps {
  config: AddButtonSettingsType
}
const AddButton = ({ config }: IProps) => {
  return (
    <div className="text-center">
      <button
        className={classes.btn}
        style={
          {
            fontSize: config.btnConfig.fontSize + 'px',
            backgroundColor: config.btnConfig.backColor,
            borderColor: config.btnConfig.borderColor,
            color: config.btnConfig.textColor,
            borderRadius: config.btnConfig.borderRadius + 'px',
            '--btnConfigHoverColor': config.btnConfig.hoverColor,
            '--btnConfigHoverBorderColor': config.btnConfig.hoverBorderColor,
            '--btnConfigHoverTextColor': config.btnConfig.hoverTextColor,
          } as CSSProperties
        }
      >
        {config.btnText}
      </button>
    </div>
  )
}

export default AddButton
