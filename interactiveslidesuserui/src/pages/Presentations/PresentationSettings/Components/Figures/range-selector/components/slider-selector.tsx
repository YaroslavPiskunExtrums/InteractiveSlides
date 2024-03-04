import React, { useRef, useState } from 'react'
import { css } from '@emotion/css'
import { H3_DEFAULT_FONT_SIZE } from '../../../../../../../lib/constants/defaultFontSize'
import { SizeType, calculateActualFont } from 'src/lib/util/calculateActualFont'
import apiLink from 'src/helpers/api_links'
import { fontsList } from 'src/lib/constants/fontFamily'

export default function SliderSelector({ figure, figureActualSize }) {
  const figureConfig =
    typeof figure?.content_config === 'string'
      ? JSON.parse(figure.content_config)
      : typeof figure.content_config === 'object'
        ? figure.content_config
        : {}

  const calculateActualFontDecorator = (defaultFontSize: string | number) => {
    return calculateActualFont(figureActualSize, JSON.parse(figure.size) as SizeType, defaultFontSize)
  }

  const config = figureConfig?.itemConfig[figureConfig.selectedItem]
  let rangeConfig = config.rangeConfig[1]
  const options = useRef(rangeConfig.options.slice(0, +rangeConfig.numberOfOptions))

  const [selected, setSelected] = useState(rangeConfig.selected || 0)

  const textConfig = config.textConfig
  const title = config.question
  const subtitle = config.subheading

  const onOptionClick = async (key) => {
    setSelected(key)
    rangeConfig.selected = key
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
    font-size: ${calculateActualFontDecorator(config.textConfig.fontSize ? config.textConfig.fontSize : '16')}px;
  `

  const fontIndex = config?.textConfig?.fontIndex || '0'

  const fontFace = css`
    @font-face {
      font-family: ${fontsList[Number(fontIndex)].name};
      font-style: normal;
      font-weight: 400;
      src: url(${apiLink}${fontsList[Number(fontIndex)].link}) format('truetype');
    }

    font-family: ${fontsList[Number(fontIndex)].name};
  `

  return (
    <div className={`slider-selector ${fontFace}`}>
      <h3
        className={'text-center'}
        style={{
          color: `${textConfig.textColor || '#000'}`,
          fontSize: `${calculateActualFontDecorator(figureConfig?.questionConfig?.fontSize || H3_DEFAULT_FONT_SIZE)}px`,
          fontFamily: fontsList[Number(fontIndex)].name,
        }}
      >
        {title}
      </h3>
      <h4
        style={{
          fontFamily: fontsList[Number(fontIndex)].name,
        }}
      >
        {subtitle}
      </h4>
      <div className={'slider-selector_radio-group'}>
        {options.current.map((option, key) => {
          const isSelected = key === selected
          return (
            <div className={`${checksWidth}`} key={key}>
              <label onClick={async () => await onOptionClick(key)} className={`slider-selector_radio-group_label`}>
                {key !== 0 && <div className={`slider-selector_radio-group_divider --left ${selectorStyles}`}></div>}
                <input className={'slider-selector_radio-group_input'} value={key} type="radio" />
                <span
                  className={`slider-selector_radio-group_checkmark ${
                    isSelected ? `--checked ${thumbStyles}` : ''
                  } ${selectorStyles}`}
                ></span>
                {options.current.length - 1 !== key && (
                  <div className={`slider-selector_radio-group_divider --right ${selectorStyles}`}></div>
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
