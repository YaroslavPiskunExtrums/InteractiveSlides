import FigureWrapper from '@components/content/figureWrapper/FigureWrapper'
import Personalization from '@components/content/figures/personalization/Personalization'
import { FiguresEnum } from '@lib/constants/figures.constants'
import { useConfigWithType } from '@lib/hooks/useConfigWithType'
import { useHideBackToConfig } from '@lib/hooks/useHideBackToConfig'
import { useSetConfig } from '@lib/hooks/useSetConfig'
import { ContentRoutesList } from '@lib/routes/routes.enum'

const PersonalizationFigure = () => {
  const config = useConfigWithType(FiguresEnum.personalization)
  useSetConfig()
  const isHide = useHideBackToConfig()

  return config ? (
    <FigureWrapper
      backLink={ContentRoutesList.personalizationSetting.path}
      isHide={isHide}
      backgroundColor={config?.backgroundConfig.backgroundColor || '#fff'}
    >
      <Personalization config={config} />
    </FigureWrapper>
  ) : (
    <></>
  )
}

export default PersonalizationFigure
