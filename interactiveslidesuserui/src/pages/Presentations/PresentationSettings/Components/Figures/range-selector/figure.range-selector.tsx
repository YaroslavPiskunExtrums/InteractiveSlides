import React, { FC } from 'react'
import './figure.range-selector.sass'
import RangeSelector from './components/range-selector'
import SliderSelector from './components/slider-selector'
import { SizeType } from 'src/lib/util/calculateActualFont'

type FigureCalculatorProps = {
  figure: { content_config: string | object; size: string }
  figureActualSize: SizeType
}

const RangeSelectorFigure: FC<FigureCalculatorProps> = ({ figure, figureActualSize }) => {
  const config =
    typeof figure?.content_config === 'string'
      ? JSON.parse(figure.content_config)
      : typeof figure.content_config === 'object'
        ? figure.content_config
        : {}

  const figureConfig = config?.itemConfig[config.selectedItem]

  const selectorType = +figureConfig?.type

  const RangeSelectorTypes = () => {
    switch (selectorType) {
      case 0:
        return <RangeSelector figure={figure} figureActualSize={figureActualSize} />
      case 1:
        return <SliderSelector figure={figure} figureActualSize={figureActualSize} />
    }
  }

  return <RangeSelectorTypes />
}

export default RangeSelectorFigure
