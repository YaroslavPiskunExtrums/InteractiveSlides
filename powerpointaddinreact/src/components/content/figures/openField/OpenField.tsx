import { OpenFieldSettingsType } from '@/types/figures/openField.types'
import { getFontFamily } from '@lib/utils/getFontFamily'
import { CSSProperties } from 'react'
import classes from './openField.module.scss'
import classNames from '@lib/utils/classNames'

const OpenField = ({ config }: { config: OpenFieldSettingsType }) => {
  return (
    <>
      <div
        className="text-center pb-2"
        style={
          {
            '--textConfigTextColor': config.textConfig.textColor,
            '--fontFamily': getFontFamily(config.textConfig.fontIndex),
            '--questionConfigFontSize': config.questionConfig.fontSize,
          } as CSSProperties
        }
      >
        <h2 className={classNames(classes.openFieldQuestion, 'text-center')}>{config.question}</h2>
        <small>{config.subheading}</small>
      </div>
      <div
        className={classes.formGroup}
        style={
          {
            '--inputConfigBackColor': config.inputConfig.backColor,
            '--inputConfigBorderColor': config.inputConfig.borderColor,
            '--inputConfigTextColor': config.inputConfig.textColor,
            '--inputConfigBorderRadius': config.inputConfig.borderRadius,
            '--inputConfigFontSize': config.inputConfig.fontSize,
          } as CSSProperties
        }
      >
        {config.type === 'textarea' ? (
          <textarea
            className={classNames(classes.openFieldInput, classes.formControl)}
            placeholder="Type here..."
          />
        ) : (
          <input
            className={classNames(classes.openFieldInput, classes.formControl)}
            type="text"
            placeholder="Type here..."
          />
        )}
      </div>
    </>
  )
}

export default OpenField
