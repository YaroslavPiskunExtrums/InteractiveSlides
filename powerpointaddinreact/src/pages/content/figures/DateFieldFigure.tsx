import FigureWrapper from '@components/content/figureWrapper/FigureWrapper'
import DateField from '@components/content/figures/dateField/DateField'
import { FiguresEnum } from '@lib/constants/figures.constants'
import { useConfigWithType } from '@lib/hooks/useConfigWithType'
import { useHideBackToConfig } from '@lib/hooks/useHideBackToConfig'
import { useSetConfig } from '@lib/hooks/useSetConfig'
import { ContentRoutesList } from '@lib/routes/routes.enum'

const DateFieldFigure = () => {
  const config = useConfigWithType(FiguresEnum.dateField)
  useSetConfig()
  const isHide = useHideBackToConfig()

  return config ? (
    <FigureWrapper
      backLink={ContentRoutesList.dateFieldSetting.path}
      isHide={isHide}
      backgroundColor={config?.backgroundConfig.backgroundColor || '#fff'}
    >
      <DateField config={config} />
    </FigureWrapper>
  ) : (
    <></>
  )
}
export default DateFieldFigure
