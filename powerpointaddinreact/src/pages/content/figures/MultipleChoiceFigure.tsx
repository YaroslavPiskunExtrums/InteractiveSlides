import FigureWrapper from '@components/content/figureWrapper/FigureWrapper'
import MultipleChoice from '@components/content/figures/multipleChoice/MultipleChoice'
import { FiguresEnum } from '@lib/constants/figures.constants'
import { useConfigWithType } from '@lib/hooks/useConfigWithType'
import { useHideBackToConfig } from '@lib/hooks/useHideBackToConfig'
import { useSetConfig } from '@lib/hooks/useSetConfig'
import { ContentRoutesList } from '@lib/routes/routes.enum'

const MultipleChoiceFigure = () => {
  const config = useConfigWithType(FiguresEnum.multipleChoice)
  useSetConfig()
  const isHide = useHideBackToConfig()
  return config ? (
    <FigureWrapper
      backLink={ContentRoutesList.multipleChoiceSetting.path}
      isHide={isHide}
      backgroundColor={config?.backgroundConfig.backgroundColor || '#fff'}
    >
      <MultipleChoice config={config} />
    </FigureWrapper>
  ) : (
    <></>
  )
}

export default MultipleChoiceFigure
