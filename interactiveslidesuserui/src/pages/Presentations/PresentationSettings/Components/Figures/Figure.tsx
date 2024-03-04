import { MutableRefObject, useEffect, useState } from 'react'
import { css } from '@emotion/css'
import { FIGURES, figuresArray } from 'src/helpers/interactive-elements'
import usePresentationSettingsStore from '../../presentation-settings.store'
import FigureOpenField from './open-field/OpenField'
import FigureButton from './button/figure.button'
import FigureCalculator from './calculator/figure.calculator'
import FigureCustomerDetails from './customer-details/figure.customer-details'
import RangeSelectorFigure from './range-selector/figure.range-selector'
import FigureMultipleChoice from './multiple-choice/figure.multiple-choice'
import FigureDateField from 'src/pages/Presentations/PresentationSettings/Components/Figures/date-field/figure.date-field'
import Personalization from './personalization/personalization'

const inchToPixel = 4 / 3

const InteractiveFigure = ({
  figureConfig,
  slideRef,
  slideConfig,
}: {
  figureConfig: any
  slideRef: MutableRefObject<HTMLImageElement>
  slideConfig: any
}) => {
  const { setActiveFigure, setIsEditMenuActive, activeFigure } = usePresentationSettingsStore() as any

  const figureSize = JSON.parse(figureConfig.size)
  const figurePosition = JSON.parse(figureConfig.bounds)
  const contentConfig =
    typeof figureConfig.content_config === 'string'
      ? JSON.parse(figureConfig.content_config)
      : figureConfig.content_config
  const selectedFigure = contentConfig?.itemConfig[contentConfig.selectedItem]

  const [width, setWidth] = useState(
    slideRef.current ? (slideRef.current.clientWidth / slideConfig.width) * (figureSize.width * inchToPixel) : 0
  )
  const [height, setHeight] = useState(
    slideRef.current ? (slideRef.current.clientHeight / slideConfig.height) * (figureSize.height * inchToPixel) : 0
  )

  const [top, setTop] = useState(
    slideRef.current ? (slideRef.current.clientHeight / slideConfig.height) * (figurePosition.top * inchToPixel) : 0
  )
  const [left, setLeft] = useState(
    slideRef.current ? (slideRef.current.clientWidth / slideConfig.width) * (figurePosition.left * inchToPixel) : 0
  )

  const resizeObserver = new ResizeObserver((entries) => {
    observeFunc(entries[0].contentRect.width, entries[0].contentRect.height)
  })

  const observeFunc = (width: number, height: number) => {
    setWidth((width / slideConfig.width) * (figureSize.width * inchToPixel))
    setHeight((height / slideConfig.height) * (figureSize.height * inchToPixel))

    setTop((height / slideConfig.height) * (figurePosition.top * inchToPixel))
    setLeft((width / slideConfig.width) * (figurePosition.left * inchToPixel))
  }

  useEffect(() => {
    if (!slideRef.current) return
    resizeObserver.observe(slideRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  const defaultFigureStyles = css`
    cursor: pointer;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${width}px;
    height: ${height}px;
    top: ${top}px;
    left: ${left}px;
    background-color: ${selectedFigure?.backgroundConfig?.backgroundColor};
  `

  const renderFigure = () => {
    switch (figuresArray[contentConfig.selectedItem]) {
      case FIGURES.OPEN_FIELD:
        return <FigureOpenField figure={figureConfig} figureActualSize={{ width, height }} />
      case FIGURES.BUTTON:
        return <FigureButton figure={figureConfig} figureActualSize={{ width, height }} />
      case FIGURES.CALCULATOR:
        return <FigureCalculator figure={figureConfig} figureActualSize={{ width, height }} />
      case FIGURES.RANGE_SELECTOR:
        return <RangeSelectorFigure figure={figureConfig} figureActualSize={{ width, height }} />
      case FIGURES.MULTIPLE_CHOICE:
        return <FigureMultipleChoice figure={figureConfig} figureActualSize={{ width, height }} />
      case FIGURES.CUSTOMER_DETAILS:
        return <FigureCustomerDetails figure={figureConfig} figureActualSize={{ width, height }} />
      case FIGURES.DATE_FIELD:
        return <FigureDateField figure={figureConfig} figureActualSize={{ width, height }} />
      case FIGURES.PERSONALIZATION:
        return <Personalization figure={figureConfig} figureActualSize={{ width, height }} />
      default:
        return <></>
    }
  }

  return (
    <div
      onClick={() => {
        setActiveFigure(figureConfig)
        setIsEditMenuActive(true)
      }}
      className={`${defaultFigureStyles} interactive-figure ${activeFigure.id === figureConfig.id ? '--active' : ''}`}
    >
      {renderFigure()}
    </div>
  )
}

export default InteractiveFigure
