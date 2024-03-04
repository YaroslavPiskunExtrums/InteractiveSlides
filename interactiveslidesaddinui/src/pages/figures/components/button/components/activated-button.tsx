import React from 'react'

import '../figure.button.sass'

import { css } from '@emotion/css'
import hexToRgba from '../../../../../lib/utils/hex-to-rgba'
import changeColorBrightness from '../../../../../lib/utils/change-color-brightness'
import { LinkTypeEnum } from '@src/lib/constants/linkType.enum'
import {FigureButtonProps} from "@src/types/figures-config.props";
export function goToAnchor(anchor: string | number) {
  const loc = document.location.toString().split('#')[0]
  document.location = loc + '#/' + `${anchor}_slide`
  console.log(loc + '#/' + `${anchor}_slide`)
  return false
}

export default function ActivatedButton({ config, onClick, active }: FigureButtonProps) {
  const buttonOnClick = () => {
    if (!config.btnConfig.link) {
      if (onClick) {
        onClick(!active)
      }
    }

    if (
      config.btnConfig.linkType === LinkTypeEnum.hyperlink &&
      typeof config.btnConfig.link === 'string'
    ) {
      window.open(config.btnConfig.link)
      return
    }
    if (config.btnConfig.link) goToAnchor(config.btnConfig.link)
  }

  const changedColor = changeColorBrightness(config.btnConfig.backColor, 0.5)

  const buttonStyles = css`
    border-radius: ${config.btnConfig.borderRadius}px;
    background-color: ${active ? changedColor : config.btnConfig.backColor};
    color: ${config.btnConfig.textColor};
    border-color: ${config.btnConfig.borderColor};
    font-size: ${config.btnConfig.fontSize ? config.btnConfig.fontSize : '16'}px;

    &:hover {
      background-color: ${config.btnConfig.hoverColor};
      color: ${config.btnConfig.hoverTextColor};
      border-color: ${config.btnConfig.hoverBorderColor};
    }

  }
  `

  //background-color: ${changeColorBrightness(-0.2, config.btnConfig.backColor)};

  const buttonActiveStyle = css`
    box-shadow: 0 0 0 0.2rem ${hexToRgba(config.btnConfig.borderColor, 0.25)};
  `

  const renderButton = () => {
    if (!config.btnConfig.linkType) {
      return (
        <button
          onClick={buttonOnClick}
          className={`figure-button ${buttonStyles} ${
            active ? `${buttonActiveStyle} --active` : ''
          }`}
        >
          {config.btnText}
        </button>
      )
    }
    return (
      <button onClick={buttonOnClick} className={`figure-button ${buttonStyles}`}>
        {config.btnText}
      </button>
    )
  }

  return renderButton()
}
