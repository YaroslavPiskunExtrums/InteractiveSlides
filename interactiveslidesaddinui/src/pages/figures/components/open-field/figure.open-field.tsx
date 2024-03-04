import React, { useState } from 'react'
import './figure.open-fileld.sass'
import { FigureOpenFieldProps } from '../../../../types/figures-config.props'
import { css } from '@emotion/css'
import InputOpenField from './input-open-field'
import { IAddinFigure } from '../../../../types/IAddinFigure'
import { useGlobalStore } from '../../../../global-store'
import { debounce } from '../../../../lib/utils/debounce'
import { PresentationAPIClient } from '../../../../lib/api/presentation-api'
import { H3_DEFAULT_FONT_SIZE } from '../../../../lib/constants/defaultFontSize'

export default function FigureOpenField({ figure }: { figure: IAddinFigure }) {
  const config: FigureOpenFieldProps['config'] = figure.content_config
  const resolveFigure = useGlobalStore((state) => state.resolve)
  const figures = useGlobalStore((state) => state.figures)
  const session = React.useRef((window as any).presentation.session)
  const { setIsLoading, setError } = useGlobalStore()
  const [value, setValue] = useState<string>(config?.value || '')
  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true)
      setValue(e.target.value)
      resolveFigure({ ...figure, content_config: config })

      config.value = e.target.value
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
      if (e instanceof Error) console.warn(JSON.stringify(e.message))
      else console.warn(JSON.stringify(e))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={'figure-open-field_openField'}>
      <h3
        style={{
          color: config?.textConfig.textColor,
          fontSize: `${config?.questionConfig?.fontSize || H3_DEFAULT_FONT_SIZE}px`,
        }}
      >
        {config?.question}
      </h3>
      <h4>{config?.subheading}</h4>
      <InputOpenField
        onChange={debounce(onInputChange, 700)}
        defaultValue={value}
        fontSize={config?.inputConfig?.fontSize || '16'}
        backColor={config?.inputConfig?.backColor}
        borderColor={config?.inputConfig?.borderColor}
        borderRadius={config?.inputConfig?.borderRadius}
        textColor={config?.inputConfig.textColor}
        type={'text'}
      />
    </div>
  )
}
