import { RangeSelectorSettingsType } from '@/types/figures/rangeSelector.types'
import { getFontFamily } from '@lib/utils/getFontFamily'
import { CSSProperties, FormEvent, Fragment, useRef, useState } from 'react'
import './rangeSelector.css'

const RangeSelector = ({ config }: { config: RangeSelectorSettingsType }) => {
  const [value, setValue] = useState(config.rangeConfig[0].min)

  const onInput = (e: FormEvent<HTMLInputElement>) => {
    ;(e.currentTarget.parentNode as any)?.style.setProperty('--value', e.currentTarget.value)
    ;(e.currentTarget.parentNode as any)?.style.setProperty(
      '--text-value',
      JSON.stringify(e.currentTarget.value)
    )
    setValue(e.currentTarget.value ?? '')
  }
  const pointerRef = useRef<HTMLDivElement>(null)
  return (
    <div
      style={
        {
          '--textConfigFontSize': config.textConfig.fontSize,
          '--textConfigTextColor': config.textConfig.textColor,
          '--fontFamily': getFontFamily(config.textConfig.fontIndex),
          '--questionConfigFontSize': config.questionConfig.fontSize,
        } as CSSProperties
      }
    >
      <div className="text-center pb-2">
        <h2 className={'range-selector-question text-center'}>{config.question}</h2>
        <small>{config.subheading}</small>
      </div>
      {String(config.type) === '0' ? (
        <div
          className={'range-selector-number'}
          style={
            {
              '--min': config.rangeConfig[0].min,
              '--max': config.rangeConfig[0].max,
              '--step': config.rangeConfig[0].step,
              '--value': config.rangeConfig[0].min,
              '--text-value': config.rangeConfig[0].min,
              '--primary-color': config.rangeConfig[0].primaryColor,
            } as CSSProperties
          }
        >
          <input
            type="range"
            min={config.rangeConfig[0].min}
            max={config.rangeConfig[0].max}
            step={config.rangeConfig[0].step}
            value={value}
            onInput={onInput}
          />
          <output></output>
          <div className={'range-selector-number__progress'}></div>
        </div>
      ) : (
        <div
          className={'range-selector-option'}
          style={
            {
              '--rangeConfig1PointerColor': config.rangeConfig[1].pointerColor,
              '--rangeConfig1PointerBorderColor': config.rangeConfig[1].pointerBorderColor,
              '--rangeConfig1OptionTextConfigCheckedTextColor':
                config.rangeConfig[1].optionTextConfig.checkedTextColor,
              '--rangeConfig1OptionTextConfigTextColor':
                config.rangeConfig[1].optionTextConfig.textColor,
              '--rangeConfig1PrimaryColor': config.rangeConfig[1].primaryColor,
              '--rangeConfig1NumberOfOptions': config.rangeConfig[1].numberOfOptions,
            } as CSSProperties
          }
        >
          <div id={'range-option-slider'}>
            {config.rangeConfig[1].options.map((option, index) => (
              <Fragment key={index}>
                <input
                  type="radio"
                  name="range-option"
                  id={String(index + 1)}
                  value={index + 1}
                  required
                  onClick={() => {
                    if (!pointerRef.current) return
                    pointerRef.current.style.left = `${
                      (100 * (index * 2 + 1)) / (2 * config.rangeConfig[1].numberOfOptions)
                    }%`
                  }}
                />
                <label htmlFor={String(index + 1)} data-range-option={option} />
              </Fragment>
            ))}
            <div id={'range-option-pos'} ref={pointerRef} />
          </div>
        </div>
      )}
    </div>
  )
}

export default RangeSelector
