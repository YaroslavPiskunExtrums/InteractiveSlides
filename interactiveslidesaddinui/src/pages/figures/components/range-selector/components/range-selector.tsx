import React, { useState } from 'react'
import { css } from '@emotion/css'
import { useGlobalStore } from '../../../../../global-store'
import { IAddinFigure } from '../../../../../types/IAddinFigure'
import { debounce } from '../../../../../lib/utils/debounce'
import { PresentationAPIClient } from '../../../../../lib/api/presentation-api'
import { H3_DEFAULT_FONT_SIZE } from '../../../../../lib/constants/defaultFontSize'

type RangeSelectorProps = {
  title?: string
  subtitle?: string
  rangeConfig: any
  textConfig: any
}

export default function RangeSelector({ figure }: { figure: IAddinFigure }) {
  const textConfig = figure.content_config.textConfig
  const title = figure.content_config.question
  const subtitle = figure.content_config.subheading
  const selectorType = +figure.content_config.type
  const rangeConfig: RangeSelectorProps['rangeConfig'] =
    figure.content_config?.rangeConfig[selectorType]
  const questionFontSize = figure?.content_config?.questionConfig?.fontSize

  const [value, setValue] = useState<number>(rangeConfig?.value || 0)
  const [dragging, setDragging] = useState<boolean>(false)
  const resolveFigure = useGlobalStore((state) => state.resolve)
  const figures = useGlobalStore((state) => state.figures)
  const session = React.useRef((window as any).presentation.session)
  const { setIsLoading, setError } = useGlobalStore()

  const debounceCb = React.useCallback(
    debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        setIsLoading(true)
        setValue(+e.target.value)
        rangeConfig.value = +e.target.value
        resolveFigure({ ...figure })

        const figureData = figures[figure.name]?.content_config

        const a = await PresentationAPIClient.autoSaveFigure({
          sessionId: session.current,
          id: figure.id,
          value: figureData?.rangeConfig?.[0]?.value,
          fullName: null,
          email: null,
          phone: null,
          business: null,
          additionalFields: null,
          textMessage: null,
        })
        console.log(a)

        await PresentationAPIClient.sendPresentation(figures, session.current)
      } catch (e) {
        if (e instanceof Error) console.warn(JSON.stringify(e.message))
        else console.warn(JSON.stringify(e))
      } finally {
        setIsLoading(false)
      }
    }, 700),
    [figures]
  )

  const min = rangeConfig.min || 0
  const max = rangeConfig.max || 100
  const step = rangeConfig.step || 1
  const primaryColor = rangeConfig.primaryColor || '#0366d6'

  const valueToPercent = () => {
    return ((value - min) / (max - min)) * 100
  }

  const rangeSelectorStyles = css`
    background: linear-gradient(
      to right,
      ${primaryColor} 0%,
      ${primaryColor} ${valueToPercent()}%,
      #dedede ${valueToPercent()}%,
      #dedede 100%
    );

    &::-webkit-slider-thumb {
      background: ${primaryColor};

      &:active {
        box-shadow:
          0 0 0 6px inset ${primaryColor},
          0 0 0 99px inset #fff,
          0 0 3px rgba(0, 0, 0, 0.4);
      }
    }

    &::-moz-range-thumb {
      background: ${rangeConfig.primaryColor || '#0366d6'};

      &:active {
        box-shadow:
          0 0 0 6px inset ${primaryColor},
          0 0 0 99px inset #fff,
          0 0 3px rgba(0, 0, 0, 0.4);
      }
    }
  `

  const thumbSize = 21
  const currentValueLeftPosition = `calc(${valueToPercent()}% + (${
    thumbSize - valueToPercent() * (thumbSize * 0.012)
  }px))`

  return (
    <div className={`range-selector`}>
      <h3
        style={{
          color: `${textConfig.textColor || '#000'}`,
          fontSize: `${questionFontSize || H3_DEFAULT_FONT_SIZE}px`,
        }}
      >
        {title}
      </h3>
      <h4>{subtitle}</h4>
      <div>
        <div className={'slider'}>
          <input
            onChange={(e) => {
              setValue(+e.target.value)
              debounceCb(e)
            }}
            defaultValue={value}
            type="range"
            min={min}
            max={max}
            step={step}
            className={`slider_input ${rangeSelectorStyles}`}
            onMouseDown={() => setDragging(true)}
            onMouseUp={() => setDragging(false)}
          />

          <div
            style={{
              left: currentValueLeftPosition,
              backgroundColor: `${primaryColor}`,
            }}
            className={`current-value ${dragging ? '--visible' : ''}`}
          >
            {value}
          </div>
        </div>
        <div className={'slide-extremums'}>
          <span className={'range-value --minimum'}>{min}</span>
          <span className={'range-value --maximum'}>{max}</span>
        </div>
      </div>
    </div>
  )
}
