import React, { useRef, useState } from 'react'
import { IAddinFigure } from '../../../../../types/IAddinFigure'
import { css } from '@emotion/css'
import { useGlobalStore } from '../../../../../global-store'
import { PresentationAPIClient } from '../../../../../lib/api/presentation-api'
import { H3_DEFAULT_FONT_SIZE } from '../../../../../lib/constants/defaultFontSize'

export default function SliderSelector({ figure }: { figure: IAddinFigure }) {
  let rangeConfig = figure.content_config.rangeConfig[1]
  const options = useRef(rangeConfig.options.slice(0, +rangeConfig.numberOfOptions))
  const questionFontSize = figure.content_config.questionConfig.fontSize

  const [selected, setSelected] = useState(rangeConfig.selected || 0)
  const resolveFigure = useGlobalStore((state) => state.resolve)
  const figures = useGlobalStore((state) => state.figures)
  const textConfig = figure.content_config.textConfig
  const title = figure.content_config.question
  const subtitle = figure.content_config.subheading
  const session = React.useRef((window as any).presentation.session)
  const { setError, setIsLoading } = useGlobalStore()

  const onOptionClick = async (key: number) => {
    try {
      setIsLoading(true)
      setSelected(key)
      rangeConfig.selected = key
      resolveFigure({ ...figure })
      const figureData = figures[figure.name]?.content_config

      await PresentationAPIClient.autoSaveFigure({
        sessionId: session.current,
        id: figure.id,
        value: figureData?.rangeConfig?.[1].options[figureData?.rangeConfig?.[1].selected],
        fullName: null,
        email: null,
        phone: null,
        business: null,
        additionalFields: null,
        textMessage: null,
      })
      await PresentationAPIClient.sendPresentation(figures, session.current)
    } catch (e) {
      if (e instanceof Error) console.warn(JSON.stringify(e.message))
      else console.warn(JSON.stringify(e))
    } finally {
      setIsLoading(false)
    }
  }

  const checksWidth = css`
    width: ${100 / options.current.length}%;
  `

  const thumbStyles = css`
    &::after {
      background: ${rangeConfig.pointerColor || '#0366d6'};
      border: 1px solid ${rangeConfig.pointerBorderColor || '#0366d6'};
    }
  `

  const selectorTextStyles = css`
    color: ${rangeConfig.optionTextConfig.textColor || '#000'};
  `

  const selectorTextStylesSelected = css`
    color: ${rangeConfig.optionTextConfig.checkedTextColor || '#fff'};
  `

  const selectorStyles = css`
    color: ${rangeConfig.primaryColor || '#0366d6'};
  `

  const fontSizeStyle = css`
    font-size: ${figure.content_config.textConfig.fontSize
      ? figure.content_config.textConfig.fontSize
      : '16'}px;
  `

  return (
    <div className={'slider-selector'}>
      <h3
        style={{
          color: `${textConfig.textColor || '#000'}`,
          fontSize: `${questionFontSize || H3_DEFAULT_FONT_SIZE}px`,
        }}
      >
        {title}
      </h3>
      <h4>{subtitle}</h4>
      <div className={'slider-selector_radio-group'}>
        {options.current.map((option: any, key: number) => {
          const isSelected = key === selected
          return (
            <div className={`${checksWidth}`} key={key}>
              <label
                onClick={async () => await onOptionClick(key)}
                className={`slider-selector_radio-group_label`}
              >
                {key !== 0 && (
                  <div
                    className={`slider-selector_radio-group_divider --left ${selectorStyles}`}
                  ></div>
                )}
                <input className={'slider-selector_radio-group_input'} value={key} type="radio" />
                <span
                  className={`slider-selector_radio-group_checkmark ${
                    isSelected ? `--checked ${thumbStyles}` : ''
                  } ${selectorStyles}`}
                ></span>
                {options.current.length - 1 !== key && (
                  <div
                    className={`slider-selector_radio-group_divider --right ${selectorStyles}`}
                  ></div>
                )}
              </label>
              <div
                className={`slider-selector_radio-group_text ${
                  key === 0 ? '--left' : options.current.length - 1 === key ? '--right' : ''
                }
                  ${isSelected ? selectorTextStylesSelected : selectorTextStyles} ${fontSizeStyle}`}
              >
                {option}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
