import React from 'react'
import './figure.range-selector.sass'
import RangeSelector from './components/range-selector'
import { IAddinFigure } from '../../../../types/IAddinFigure'
import SliderSelector from './components/slider-selector'

export default function RangeSelectorFigure({ figure }: { figure: IAddinFigure }) {
  const selectorType = +figure.content_config.type
  const RangeSelectorTypes = () => {
    switch (selectorType) {
      case 0:
        return <RangeSelector figure={figure} />
      case 1:
        return <SliderSelector figure={figure} />
    }
  }

  return <RangeSelectorTypes />
}
