import FigureWrapper from '@components/content/figureWrapper/FigureWrapper'
import RangeSelector from '@components/content/figures/rangeSelector/RangeSelector'
import { FiguresEnum } from '@lib/constants/figures.constants'
import { useConfigWithType } from '@lib/hooks/useConfigWithType'
import { useHideBackToConfig } from '@lib/hooks/useHideBackToConfig'
import { useSetConfig } from '@lib/hooks/useSetConfig'
import { ContentRoutesList } from '@lib/routes/routes.enum'

const RangeSelectorFigure = () => {
  const config = useConfigWithType(FiguresEnum.rangeSelector)
  useSetConfig()
  const isHide = useHideBackToConfig()

  return config ? (
    <FigureWrapper
      backLink={ContentRoutesList.rangeSelectorSetting.path}
      isHide={isHide}
      backgroundColor={config?.backgroundConfig.backgroundColor || '#fff'}
    >
      <RangeSelector config={config} />
    </FigureWrapper>
  ) : (
    <></>
  )
}

export default RangeSelectorFigure
