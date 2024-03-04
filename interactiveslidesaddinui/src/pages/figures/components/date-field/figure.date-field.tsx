import { H3_DEFAULT_FONT_SIZE } from '@src/lib/constants/defaultFontSize'
import React, { useState } from 'react'
import { IAddinFigure } from '@src/types/IAddinFigure'
import { FigureDateFieldProps } from '@src/types/figures-config.props'
import { useGlobalStore } from '@src/global-store'
import InputOpenField from '@src/pages/figures/components/open-field/input-open-field'
import { debounce } from '@src/lib/utils/debounce'
import { css } from '@emotion/css'
import hexToRgba from '@src/lib/utils/hex-to-rgba'
import './figure.date-field.sass'
import { PresentationAPIClient } from '@src/lib/api/presentation-api'
function formatDate(date: Date | string | number) {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  console.log('DATE', date, d)

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}
export default function FigureDateField({ figure }: { figure: IAddinFigure }) {
  const config: FigureDateFieldProps['config'] = figure.content_config

  const resolveFigure = useGlobalStore((state) => state.resolve)
  const figures = useGlobalStore((state) => state.figures) as any
  const { setIsLoading, setError } = useGlobalStore()

  const [value, setValue] = useState<string>(formatDate(+config?.value || new Date()))

  const session = React.useRef((window as any).presentation.session)
  const inputStyle = css`
    font-size: ${config?.inputConfig?.fontSize || '16'}px;
    background-color: ${config?.inputConfig?.backColor || '#000'};
    border-color: ${config?.inputConfig?.borderColor || '#fff'};
    border-radius: ${config?.inputConfig?.borderRadius}px;
    color: ${config?.inputConfig.textColor};

    &:focus {
      box-shadow: 0 0 0 0.2rem ${hexToRgba(config?.inputConfig?.borderColor, 0.25)};
    }

    &:read-only {
      background-color: ${config?.inputConfig?.backColor || '#fff'};
      color: ${config?.inputConfig.textColor || '#000'};
      border-color: ${config?.inputConfig?.borderColor || '#fff'};
      border-radius: ${config?.inputConfig?.borderRadius}px;
      font-size: ${config?.inputConfig?.fontSize || '16'}px;
    }
  `

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true)
      setValue(e.target.value)
      resolveFigure({ ...figure, content_config: config })

      console.log('VALIE', e.target.value)

      config.value = new Date(e.target.value).getTime().toString()
      const figureData = figures[figure.name]?.content_config

      await PresentationAPIClient.autoSaveFigure({
        sessionId: session.current,
        id: figure.id,
        value: figureData?.value,
        fullName: null,
        email: null,
        phone: null,
        business: null,
        additionalFields: null,
        textMessage: null,
      })
      await PresentationAPIClient.sendPresentation(
        JSON.parse(
          JSON.stringify({
            ...figures,
            [figure.name]: {
              ...figure,
              content_config: config,
            },
          })
        ),
        session.current
      )
    } catch (e) {
      if (e instanceof Error) setError(e.message)
      else setError(JSON.stringify(e))
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={'figure-date-field'}>
      <h3
        style={{
          color: config.textConfig.textColor,
          fontSize: `${config?.questionConfig?.fontSize || H3_DEFAULT_FONT_SIZE}px`,
        }}
      >
        {config.question}
      </h3>
      <input
        type={'date'}
        onChange={onInputChange}
        className={`answer_input ${inputStyle}`}
        placeholder={''}
        value={value}
      />
    </div>
  )
}
