import React from 'react'

import './figure.button.sass'
import { css } from '@emotion/css'
import changeColorBrightness from '../../../../../../helpers/changeColorBrightness'
import { SizeType, calculateActualFont } from 'src/lib/util/calculateActualFont'

export default function ActivatedButton({ config, active, figureActualSize, size }) {
  const changedColor = changeColorBrightness(config.btnConfig.backColor, 0.5)

  const calculateActualFontDecorator = (defaultFontSize: string | number) => {
    return calculateActualFont(figureActualSize, JSON.parse(size) as SizeType, defaultFontSize)
  }

  const buttonStyles = css`
    border-radius: ${config.btnConfig.borderRadius}px;
    background-color: ${active ? changedColor : config.btnConfig.backColor};
    color: ${config.btnConfig.textColor};
    border-color: ${config.btnConfig.borderColor};
    font-size: ${calculateActualFontDecorator(config.btnConfig.fontSize ? config.btnConfig.fontSize : '16')}px;

    &:hover {
      background-color: ${config.btnConfig.hoverColor};
      color: ${config.btnConfig.hoverTextColor};
      border-color: ${config.btnConfig.hoverBorderColor};
    }

  }
  `

  const renderButton = () => {
    return <button className={`figure-button ${buttonStyles}`}>{config.btnText}</button>
  }

  return renderButton()
}
