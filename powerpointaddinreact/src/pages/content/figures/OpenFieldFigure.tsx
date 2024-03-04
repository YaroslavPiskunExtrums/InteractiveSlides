import FigureWrapper from '@components/content/figureWrapper/FigureWrapper'
import OpenField from '@components/content/figures/openField/OpenField'
import { FiguresEnum } from '@lib/constants/figures.constants'
import { useConfigWithType } from '@lib/hooks/useConfigWithType'
import { useHideBackToConfig } from '@lib/hooks/useHideBackToConfig'
import { useSetConfig } from '@lib/hooks/useSetConfig'
import { ContentRoutesList } from '@lib/routes/routes.enum'

const OpenFieldFigure = () => {
  const config = useConfigWithType(FiguresEnum.openField)
  useSetConfig()
  const isHide = useHideBackToConfig()
  return config ? (
    <FigureWrapper
      backLink={ContentRoutesList.openFieldSetting.path}
      isHide={isHide}
      backgroundColor={config?.backgroundConfig.backgroundColor || '#fff'}
    >
      <OpenField config={config} />
    </FigureWrapper>
  ) : (
    <></>
  )
}

export default OpenFieldFigure
