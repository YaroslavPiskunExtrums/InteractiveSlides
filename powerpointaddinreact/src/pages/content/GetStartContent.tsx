import { FiguresConfigTypes } from '@/types/figures/figures.types'
import LoadScreen from '@components/common/loadScreen/LoadScreen'
import { ContentRoutesList, contentFigureList } from '@lib/routes/routes.enum'
import { getSavedConfig } from '@lib/utils/addin'
import { getFigureConfigFromUserUI } from '@lib/utils/getFigureConfigFromUserUI'
import { useConfig } from '@store/config.store'
import { useRoute } from '@store/routing.store'
import { useCallback, useEffect } from 'react'

const GetStartContent = () => {
  const { setHash } = useRoute()
  const { isSavedFigureConfigFromUI, setConfig, setIsSavedFigureConfigFromUI } = useConfig()

  const getConfigAndRedirect = useCallback(async () => {
    const figureConfig = getSavedConfig()
    let configFromUserUi: FiguresConfigTypes | null = null

    if (!isSavedFigureConfigFromUI) {
      configFromUserUi = await getFigureConfigFromUserUI()
      setIsSavedFigureConfigFromUI(true)
    }

    if (!figureConfig && !configFromUserUi) return
    setConfig(configFromUserUi ? configFromUserUi : figureConfig)

    const pathToRedirect =
      contentFigureList.find(
        (content) =>
          content.type ===
          (configFromUserUi ? configFromUserUi.figureType : figureConfig?.figureType)
      )?.link ?? ''

    setHash(pathToRedirect)
  }, [])

  useEffect(() => {
    getConfigAndRedirect()
  }, [getConfigAndRedirect])

  return <LoadScreen onClick={() => setHash(ContentRoutesList.figureList.path)} />
}

export default GetStartContent
