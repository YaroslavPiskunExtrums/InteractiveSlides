import React, { useEffect, useState } from 'react'
import './figure.button.sass'
import { FigureButtonProps } from '../../../../types/figures-config.props'
import hexToRgba from '../../../../lib/utils/hex-to-rgba'
import ActivatedButton from './components/activated-button'
import { IAddinFigure } from '../../../../types/IAddinFigure'
import { useGlobalStore } from '../../../../global-store'
import { debounce } from '../../../../lib/utils/debounce'
import { PresentationAPIClient } from '../../../../lib/api/presentation-api'

export default function FigureButton({ figure }: { figure: IAddinFigure }) {
  const config: FigureButtonProps['config'] = figure.content_config
  const [active, setActive] = useState<boolean>(config?.clicked || false)
  const resolveFigure = useGlobalStore((state) => state.resolve)
  const figures = useGlobalStore((state) => state.figures)
  const session = React.useRef((window as any).presentation.session)
  const { setIsLoading, setError } = useGlobalStore()

  const onFigureButtonClick = async (state: boolean) => {
    try {
      setIsLoading(true)
      config.clicked = state
      setActive(state)
      resolveFigure({ ...figure })

      const figureData = figures[figure.name]?.content_config

      await PresentationAPIClient.autoSaveFigure({
        sessionId: session.current,
        id: figure.id,
        value: figureData?.clicked,
        fullName: null,
        email: null,
        phone: null,
        business: null,
        additionalFields: null,
        textMessage: null,
      })

      await PresentationAPIClient.sendPresentation(figures, session.current)
    } catch (e) {
      if (e instanceof Error) console.warn(JSON.stringify(e.message))
      else console.warn(JSON.stringify(e))
    } finally {
      setIsLoading(false)
    }
  }

  return <ActivatedButton config={config} active={active} onClick={onFigureButtonClick} />
}
