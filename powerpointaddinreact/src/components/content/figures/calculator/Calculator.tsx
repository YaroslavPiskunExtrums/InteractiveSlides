import { CSSProperties } from 'react'
import classes from './calculator.module.scss'
import { getFontFamily } from '@lib/utils/getFontFamily'
import { CalculatorSettingsType } from '@/types/figures/calculator.types'

interface IProps {
  config: CalculatorSettingsType
}
const Calculator = ({ config }: IProps) => {
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
        <h2 className={classes.calculatorQuestion}>{config.question}</h2>
        <small>{config.subheading}</small>
      </div>
      <div className="mb-4">
        <input readOnly className={classes.calculatorAnswerInput} type="text" id="openfieldinput" />
      </div>
    </div>
  )
}

export default Calculator
