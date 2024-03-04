import React, { FC, useState } from 'react'
import './figure.multiple-choice.sass'
import ActivatedButton from '../button/activated-button'
import { H3_DEFAULT_FONT_SIZE } from '../../../../../../lib/constants/defaultFontSize'
import CustomDropdown from '../customer-details/components/custom-dropdown'
import { SizeType, calculateActualFont } from 'src/lib/util/calculateActualFont'
import { css } from '@emotion/css'
import { fontsList } from 'src/lib/constants/fontFamily'
import apiLink from 'src/helpers/api_links'

type FigureMultipleChoiceProps = {
  figure: { content_config: string | object; size: string }
  figureActualSize: SizeType
}

const FigureMultipleChoice: FC<FigureMultipleChoiceProps> = ({ figure, figureActualSize }) => {
  const config =
    typeof figure?.content_config === 'string'
      ? JSON.parse(figure.content_config)
      : typeof figure.content_config === 'object'
        ? figure.content_config
        : {}

  const calculateActualFontDecorator = (defaultFontSize: string | number) => {
    return calculateActualFont(figureActualSize, JSON.parse(figure.size) as SizeType, defaultFontSize)
  }

  const figureConfig = config?.itemConfig[config.selectedItem]

  const [activeIndex, setActiveIndex] = useState(figureConfig?.selected || 0)

  const multipleChoiceClick = async (index) => {
    setActiveIndex(index)
    figureConfig.selected = index
  }

  const MultipleChoiceView = ({ config }) => {
    if (!config.view) {
      config.view = 'button-list'
    }

    if (figureConfig.view === 'button-list') {
      figureConfig.btnConfig.fontSize = figureConfig.textConfig.fontSize
      return (config.answers as ({ label: string; value: string } | string)[]).map((answer, index) => {
        let answerText = ''

        if (typeof answer === 'object') {
          answerText = answer.label
        } else {
          answerText = answer
        }

        return (
          <div key={index} className={`answer ${answerText}`}>
            <ActivatedButton
              config={{ btnConfig: figureConfig.btnConfig, btnText: answerText }}
              active={index === activeIndex}
              figureActualSize={figureActualSize}
              size={figure.size}
            />
          </div>
        )
      })
    }
    if (figureConfig.view === 'dropdown-list' || figureConfig.view === 'multiple-selector') {
      const options = figureConfig.answers.map((v, i) => {
        if (typeof v === 'object' && typeof v.label === 'string') {
          return { id: i.toString(), value: v.label }
        }

        return { id: i.toString(), value: v }
      })

      const getValueFromDropdownConfig = (field: string, initValue: string): string => {
        return !!config.dropdownConfig?.[field] ? config.dropdownConfig?.[field] : initValue
      }

      const fontColor = getValueFromDropdownConfig('fontColor', '#000000')
      const backgroundColor = getValueFromDropdownConfig('backgroundColor', '#ffffff')
      const borderRadius = getValueFromDropdownConfig('borderRadius', '4')
      const hoverColor = getValueFromDropdownConfig('hoverColor', '#5bc5fa')
      const borderColor = getValueFromDropdownConfig('borderColor', '#ffffff')
      const hoverTextColor = getValueFromDropdownConfig('hoverTextColor', '#ffffff')

      const fontSize = String(
        calculateActualFontDecorator(!!config.textConfig.fontSize ? config.textConfig.fontSize : '16')
      )
      return (
        <CustomDropdown
          options={options}
          onChange={(e) => multipleChoiceClick(+e.currentTarget.value)}
          selectedIndex={activeIndex}
          fontSize={fontSize}
          background={backgroundColor}
          dropdownFontColor={fontColor}
          dropdownBorderRadius={borderRadius}
          dropdownHoverColor={hoverColor}
          dropdownBorderColor={borderColor}
          dropdownHoverTextColor={hoverTextColor}
          width="100"
          view={figureConfig.view}
        />
      )
    }
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
    <div className={`figure-multiple-choice --${figureConfig.view} ${fontFace}`}>
      {figureConfig.imageUrl && (
        <img className={'figure-multiple-choice_image'} src={figureConfig.imageUrl} alt={'Multiple Choice'} />
      )}

      <h3
        className={'question'}
        style={{
          color: figureConfig?.textConfig?.textColor,
          fontSize: `${calculateActualFontDecorator(figureConfig?.questionConfig?.fontSize || H3_DEFAULT_FONT_SIZE)}px`,
          fontFamily: fontsList[Number(fontIndex)].name,
        }}
      >
        {figureConfig.question}
      </h3>

      <div className={'answers-list'}>
        <MultipleChoiceView config={figureConfig} />
      </div>
    </div>
  )
}

export default FigureMultipleChoice
