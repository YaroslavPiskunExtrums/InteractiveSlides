import React, { FC, useState } from 'react'
import './figure.open-fileld.sass'
import InputOpenField from './input-open-field'
import { H3_DEFAULT_FONT_SIZE } from '../../../../../../lib/constants/defaultFontSize'
import { SizeType, calculateActualFont } from 'src/lib/util/calculateActualFont'
import { css } from '@emotion/css'
import apiLink from 'src/helpers/api_links'
import { fontsList } from 'src/lib/constants/fontFamily'

type FigureOpenFieldProps = {
  figure: { content_config: string | object; size: string }
  figureActualSize: SizeType
}

const FigureOpenField: FC<FigureOpenFieldProps> = ({ figure, figureActualSize }) => {
  const contentConfig =
    typeof figure?.content_config === 'string'
      ? JSON.parse(figure.content_config)
      : typeof figure.content_config === 'object'
        ? figure.content_config
        : {}
  const figureConfig = contentConfig?.itemConfig[contentConfig.selectedItem]

  const [value] = useState(figureConfig?.value || '')

  const calculateActualFontDecorator = (defaultFontSize: string | number) => {
    return calculateActualFont(figureActualSize, JSON.parse(figure.size) as SizeType, defaultFontSize)
  }

  const fontIndex = figureConfig?.textConfig?.fontIndex || '0'

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
    <div className={`figure-open-field ${fontFace}`}>
      <h3
        style={{
          color: figureConfig.textConfig.textColor,
          fontSize: `${calculateActualFontDecorator(figureConfig?.questionConfig?.fontSize || H3_DEFAULT_FONT_SIZE)}px`,
          fontFamily: fontsList[Number(fontIndex)].name,
        }}
      >
        {figureConfig.question}
      </h3>
      <h4
        style={{
          fontFamily: fontsList[Number(fontIndex)].name,
        }}
      >
        {figureConfig.subheading}
      </h4>
      <InputOpenField
        defaultValue={value}
        fontSize={String(calculateActualFontDecorator(figureConfig.inputConfig.fontSize))}
        backColor={figureConfig.inputConfig.backColor}
        borderColor={figureConfig.inputConfig.borderColor}
        borderRadius={figureConfig.inputConfig.borderRadius}
        textColor={figureConfig?.inputConfig?.textColor}
        type={'text'}
        onChange={() => {}}
      />
    </div>
  )
}

export default FigureOpenField
