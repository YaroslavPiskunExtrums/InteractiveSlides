import React, { FC, useState } from 'react'
import './figure.button.sass'
import ActivatedButton from './activated-button'
import { SizeType } from 'src/lib/util/calculateActualFont'

type FigureButtonProps = {
  figure: { content_config: string | object; size: string }
  figureActualSize: SizeType
}

const FigureButton: FC<FigureButtonProps> = ({ figure, figureActualSize }) => {
  const [active, setActive] = useState(false)

  const contentConfig =
    typeof figure?.content_config === 'string'
      ? JSON.parse(figure.content_config)
      : typeof figure.content_config === 'object'
        ? figure.content_config
        : {}
  const figureConfig = contentConfig?.itemConfig[contentConfig.selectedItem]

  return (
    <ActivatedButton config={figureConfig} active={active} figureActualSize={figureActualSize} size={figure.size} />
  )
}

export default FigureButton
