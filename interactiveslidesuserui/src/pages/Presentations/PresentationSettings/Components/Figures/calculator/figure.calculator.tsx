import React, { FC } from 'react'
import { H3_DEFAULT_FONT_SIZE } from '../../../../../../lib/constants/defaultFontSize'
import InputOpenField from '../open-field/input-open-field'
import './figure.calculator.sass'
import { SizeType, calculateActualFont } from 'src/lib/util/calculateActualFont'
import { css } from '@emotion/css'
import apiLink from 'src/helpers/api_links'
import { fontsList } from 'src/lib/constants/fontFamily'

type FigureCalculatorProps = {
  figure: { content_config: string | object; size: string }
  figureActualSize: SizeType
}

const FigureCalculator: FC<FigureCalculatorProps> = ({ figure, figureActualSize }) => {
  const contentConfig =
    typeof figure?.content_config === 'string'
      ? JSON.parse(figure.content_config)
      : typeof figure.content_config === 'object'
        ? figure.content_config
        : {}

  const calculateActualFontDecorator = (defaultFontSize: string | number) => {
    return calculateActualFont(figureActualSize, JSON.parse(figure.size) as SizeType, defaultFontSize)
  }

  const figureConfig = contentConfig?.itemConfig[contentConfig.selectedItem]

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
    <div className={`figure-calculator ${fontFace}`}>
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
          fontSize: `${calculateActualFontDecorator(19.5)}px`,
          fontFamily: fontsList[Number(fontIndex)].name,
        }}
      >
        {figureConfig.subheading}
      </h4>
      <InputOpenField
        defaultValue={''}
        fontSize={String(calculateActualFontDecorator(figureConfig.inputConfig.fontSize))}
        backColor={figureConfig.inputConfig.backColor}
        borderColor={figureConfig.inputConfig.borderColor}
        borderRadius={figureConfig.inputConfig.borderRadius}
        textColor={figureConfig.inputConfig.textColor}
        placeholder={''}
        type={'text'}
        readonly
        onChange={() => {}}
      />
    </div>
  )
}

export default FigureCalculator
