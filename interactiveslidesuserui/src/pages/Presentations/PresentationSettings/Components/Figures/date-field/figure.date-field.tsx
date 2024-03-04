import React, { FC } from 'react'
import { css } from '@emotion/css'
import hexToRgba from '../../../../../../helpers/hexToRgba'
import { H3_DEFAULT_FONT_SIZE } from 'src/lib/constants/defaultFontSize'
import './figure.date-field.sass'
import { SizeType, calculateActualFont } from 'src/lib/util/calculateActualFont'
import apiLink from 'src/helpers/api_links'
import { fontsList } from 'src/lib/constants/fontFamily'
type FigureDateFieldProps = {
  figure: { content_config: string | object; size: string }
  figureActualSize: SizeType
}

const FigureDateField: FC<FigureDateFieldProps> = ({ figure, figureActualSize }) => {
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

  const inputStyle = css`
    font-size: ${calculateActualFontDecorator(config?.inputConfig?.fontSize || '16')}px;
    background-color: ${config?.inputConfig?.backColor || '#000'};
    border-color: ${config?.inputConfig?.borderColor || '#fff'};
    border-radius: ${config?.inputConfig?.borderRadius}px;
    color: ${config?.inputConfig.textColor};

    &:focus {
      box-shadow: 0 0 0 0.2rem ${hexToRgba(config?.inputConfig?.borderColor, 0.25)};
    }

    &:read-only {
      background-color: ${config?.inputConfig?.backColor || '#fff'};
      color: ${config?.inputConfig.textColor || '#000'};
      border-color: ${config?.inputConfig?.borderColor || '#fff'};
      border-radius: ${config?.inputConfig?.borderRadius}px;
      font-size: ${calculateActualFontDecorator(config?.inputConfig?.fontSize || '16')}px;
    }
  `

  return (
    <div className={`figure-date-field ${fontFace}`}>
      <h3
        style={{
          color: config.textConfig.textColor ?? '#000',
          fontSize: `${calculateActualFontDecorator(config?.questionConfig?.fontSize || H3_DEFAULT_FONT_SIZE)}px`,
          fontFamily: fontsList[Number(fontIndex)].name,
        }}
      >
        {config.question}
      </h3>
      <input type={'date'} className={`answer_input ${inputStyle}`} placeholder={''} />
    </div>
  )
}

export default FigureDateField
