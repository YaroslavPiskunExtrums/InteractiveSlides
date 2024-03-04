import React, { useState } from 'react'
import { css } from '@emotion/css'
import { H3_DEFAULT_FONT_SIZE } from '../../../../../../../lib/constants/defaultFontSize'
import { SizeType, calculateActualFont } from 'src/lib/util/calculateActualFont'
import apiLink from 'src/helpers/api_links'
import { fontsList } from 'src/lib/constants/fontFamily'

export default function RangeSelector({ figure, figureActualSize }) {
  const figureConfig =
    typeof figure?.content_config === 'string'
      ? JSON.parse(figure.content_config)
      : typeof figure.content_config === 'object'
        ? figure.content_config
        : {}

  const config = figureConfig?.itemConfig[figureConfig.selectedItem]

  const textConfig = config.textConfig
  const title = config.question
  const subtitle = config.subheading
  const rangeConfig = config?.rangeConfig[0]

  const calculateActualFontDecorator = (defaultFontSize: string | number) => {
    return calculateActualFont(figureActualSize, JSON.parse(figure.size) as SizeType, defaultFontSize)
  }

  const [value, setValue] = useState(rangeConfig?.value || 0)
  const [dragging, setDragging] = useState(false)

  const min = rangeConfig.min || 0
  const max = rangeConfig.max || 100
  const step = rangeConfig.step || 1
  const primaryColor = rangeConfig.primaryColor || '#0366d6'

  const valueToPercent = () => {
    return ((value - min) / (max - min)) * 100
  }

  const rangeSelectorStyles = css`
    background: linear-gradient(
      to right,
      ${primaryColor} 0%,
      ${primaryColor} ${valueToPercent()}%,
      #dedede ${valueToPercent()}%,
      #dedede 100%
    );

    &::-webkit-slider-thumb {
      background: ${primaryColor};

      &:active {
        box-shadow:
          0 0 0 6px inset ${primaryColor},
          0 0 0 99px inset #fff,
          0 0 3px rgba(0, 0, 0, 0.4);
      }
    }

    &::-moz-range-thumb {
      background: ${rangeConfig.primaryColor || '#0366d6'};

      &:active {
        box-shadow:
          0 0 0 6px inset ${primaryColor},
          0 0 0 99px inset #fff,
          0 0 3px rgba(0, 0, 0, 0.4);
      }
    }
  `

  const thumbSize = 21
  const currentValueLeftPosition = `calc(${valueToPercent()}% + (${
    thumbSize - valueToPercent() * (thumbSize * 0.012)
  }px))`

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
    <div className={`range-selector ${fontFace}`}>
      <h3
        style={{
          color: `${textConfig.textColor || '#000'}`,
          fontSize: `${calculateActualFontDecorator(config?.questionConfig?.fontSize || H3_DEFAULT_FONT_SIZE)}px`,
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
      <div>
        <div className={'slider'}>
          <input
            onChange={(e) => {
              setValue(+e.target.value)
            }}
            defaultValue={value}
            type="range"
            min={min}
            max={max}
            step={step}
            className={`slider_input ${rangeSelectorStyles}`}
            onMouseDown={() => setDragging(true)}
            onMouseUp={() => setDragging(false)}
          />

          <div
            style={{
              left: currentValueLeftPosition,
              backgroundColor: `${primaryColor}`,
            }}
            className={`current-value ${dragging ? '--visible' : ''}`}
          >
            {value}
          </div>
        </div>
        <div className={'slide-extremums'}>
          <span className={'range-value --minimum'}>{min}</span>
          <span className={'range-value --maximum'}>{max}</span>
        </div>
      </div>
    </div>
  )
}
