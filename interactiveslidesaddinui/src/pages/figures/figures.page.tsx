import React, { useEffect, useRef, useState } from 'react'
import { IAddinFigure } from '../../types/IAddinFigure'
import { Figures } from '../../enums/figures'
import RangeSelectorFigure from './components/range-selector/figure.range-selector'
import './figures.page.sass'
import FigureButton from './components/button/figure.button'
import FigureMultipleChoice from './components/multiple-choice/figure.multiple-choice'
import FigureOpenField from './components/open-field/figure.open-field'
import FigureCustomerDetails from './components/customer-details/figure.customer-details'
import { useGlobalStore } from '../../global-store'

import sizeMap from './size-map-config'
import { css } from '@emotion/css'
import FigureCalculator from './components/calculator/figure.calculator'
import FigureDateField from '@src/pages/figures/components/date-field/figure.date-field'
import FigurePersonalization from '@src/pages/figures/components/personalization/figure.personalization'

const inchToPixel = 4 / 3

export type FiguresPageProps = {
  addinFigures: IAddinFigure[]
  width: number
  height: number
  slide: number
}

const fontsList = [
  { name: 'arial', index: '0', link: '/fonts/arial.ttf' },
  { name: 'verdana', index: '1', link: '/fonts/verdana.ttf' },
  { name: 'tahoma', index: '2', link: '/fonts/tahoma.ttf' },
  { name: 'trebuchet ms', index: '3', link: '/fonts/trebuchet ms.ttf' },
  { name: 'Times New Roman', index: '4', link: '/fonts/Times New Roman.ttf' },
  { name: 'georgia', index: '5', link: '/fonts/georgia.ttf' },
  { name: 'garamond', index: '6', link: '/fonts/garamond.ttf' },
  { name: 'courier new', index: '7', link: '/fonts/courier new.ttf' },
  { name: 'Brush Script MT', index: '8', link: '/fonts/Brush Script MT.ttf' },
  { name: 'Onest', index: '9', link: '/fonts/Onest.ttf' },
]

const returnFigurePosition = (
  figure: IAddinFigure,
  actualSlideSize: { height: number; width: number },
  originalSlideSize: { height: number; width: number }
) => {
  const heightPercent = actualSlideSize.height / originalSlideSize.height
  const widthPercent = actualSlideSize.width / originalSlideSize.width

  const transformedTop = figure.bounds.top * inchToPixel * heightPercent
  const transformedLeft = figure.bounds.left * inchToPixel * widthPercent
  const transformedHeight = figure.size.height * inchToPixel * heightPercent
  const transformedWidth = figure.size.width * inchToPixel * widthPercent

  return {
    top: `${transformedTop}px`,
    left: `${transformedLeft}px`,
    width: `${transformedWidth}px`,
    height: `${transformedHeight}px`,
  }
}

const RenderFigure = (figure: IAddinFigure) => {
  if (figure.figureName === Figures.MULTIPLE_CHOICE) {
    return <FigureMultipleChoice figure={figure} />
  }
  if (figure.figureName === Figures.RANGE_SELECTOR) {
    return <RangeSelectorFigure figure={figure} />
  }
  if (figure.figureName === Figures.OPEN_FIELD) {
    return <FigureOpenField figure={figure} />
  }
  if (figure.figureName === Figures.CUSTOMER_DETAILS) {
    return <FigureCustomerDetails figure={figure} />
  }
  if (figure.figureName === Figures.BUTTON) {
    return <FigureButton figure={figure} />
  }
  if (figure.figureName === Figures.CALCULATOR) {
    return <FigureCalculator figure={figure} />
  }
  if (figure.figureName === Figures.DATE_FIELD) {
    return <FigureDateField figure={figure} />
  }
  if (figure.figureName === Figures.PERSONALIZATION) {
    return <FigurePersonalization figure={figure} />
  }
}
const returnBackgroundColors = (figure: IAddinFigure) => {
  const backgroundColor = figure.content_config?.backgroundConfig?.backgroundColor

  return css`
    background-color: ${backgroundColor ? backgroundColor : '#fff'};
  `
}

export default function FiguresPage({ addinFigures, height, width, slide }: FiguresPageProps) {
  const resolveFigure = useGlobalStore((state) => state.resolve)

  useEffect(() => {
    addinFigures.forEach((figure) => {
      resolveFigure(figure)
    })
  }, [])

  const [imageHeight, setImageHeight] = useState(0)
  const [imageWidth, setImageWidth] = useState(0)

  const divRef = useRef<null | HTMLDivElement>(null)

  const changeImageSize = () => {
    setTimeout(() => {
      const image = document.getElementById(slide + '_slide_image')
      setImageWidth(image.offsetWidth)
      setImageHeight(image.offsetHeight)
    }, 250)
  }

  const observe = () => {
    const observer = new IntersectionObserver(changeImageSize)

    observer.observe(divRef.current)
  }

  useEffect(() => {
    if (!window) return

    //@ts-ignore
    window.Reveal.on('overviewhidden', (event) => {
      observe()
    })
    //@ts-ignore
    window.Reveal.on('overviewshown', (event) => {
      observe()
    })
  }, [])

  useEffect(() => {
    if (!window) return

    observe()
    window.addEventListener('resize', observe)

    return () => {
      window.removeEventListener('resize', observe)
    }
  }, [divRef?.current, divRef])

  const actualSlideSize = {
    height: imageHeight,
    width: imageWidth,
  }
  const originalSlideSize = {
    height: height,
    width: width,
  }

  return (
    <div
      ref={divRef}
      style={{
        height: imageHeight,
        width: imageWidth,
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {addinFigures.map((figure, i) => {
        const position = returnFigurePosition(figure, actualSlideSize, originalSlideSize)
        const fontIndex = figure.content_config.textConfig?.fontIndex
        const fontFaceStyle = fontIndex
          ? css`
              @font-face {
                font-family: ${fontsList[Number(fontIndex)].name};
                font-style: normal;
                font-weight: 400;
                src: url(${fontsList[Number(fontIndex)].link}) format('truetype');
              }
            `
          : ''
        return (
          <div
            key={i}
            className={`figure-container-wrapper ${returnBackgroundColors(
              figure
            )} ${fontFaceStyle}`}
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
              height: position.height,
              fontFamily: fontsList[Number(fontIndex)].name,
            }}
          >
            {figure.content_config && RenderFigure(figure)}
          </div>
        )
      })}
    </div>
  )
}
