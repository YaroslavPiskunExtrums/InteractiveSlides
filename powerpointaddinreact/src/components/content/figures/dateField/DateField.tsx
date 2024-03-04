import { DateFieldSettingsType } from '@/types/figures/dateField.types'
import { getFontFamily } from '@lib/utils/getFontFamily'
import { CSSProperties } from 'react'
import classes from './dateField.module.scss'
import classNames from '@lib/utils/classNames'

interface IProps {
  config: DateFieldSettingsType
}

const DateField = ({ config }: IProps) => {
  return (
    <div
      style={
        {
          '--textConfigTextColor': config.textConfig.textColor,
          '--fontFamily': getFontFamily(config.textConfig.fontIndex),
          '--questionConfigFontSize': config.questionConfig.fontSize,
          '--inputConfigBackColor': config.inputConfig.backColor,
          '--inputConfigBorderColor': config.inputConfig.borderColor,
          '--inputConfigTextColor': config.inputConfig.textColor,
          '--inputConfigBorderRadius': config.inputConfig.borderRadius,
          '--inputConfigFontSize': config.inputConfig.fontSize,
        } as CSSProperties
      }
    >
      <div className="text-center pb-2">
        <h2 className={classNames('text-center', classes.dateFieldQuestion)}>{config.question}</h2>
      </div>
      <div className={classes.formGroup}>
        <input
          type="date"
          className={classNames(classes.dateFieldAnswerInput, classes.formControl)}
          id="openfieldinput"
        />
      </div>
    </div>
  )
}

export default DateField
