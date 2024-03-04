import FigureWrapper from '@components/content/figureWrapper/FigureWrapper'
import Calculator from '@components/content/figures/calculator/Calculator'
import { FiguresEnum } from '@lib/constants/figures.constants'
import { useConfigWithType } from '@lib/hooks/useConfigWithType'
import { useHideBackToConfig } from '@lib/hooks/useHideBackToConfig'
import { useSetConfig } from '@lib/hooks/useSetConfig'
import { ContentRoutesList } from '@lib/routes/routes.enum'

const CalculatorFigure = () => {
  const config = useConfigWithType(FiguresEnum.calculator)
  useSetConfig()
  const isHide = useHideBackToConfig()
  return config ? (
    <FigureWrapper
      backLink={ContentRoutesList.calculatorSetting.path}
      isHide={isHide}
      backgroundColor={config?.backgroundConfig.backgroundColor || '#fff'}
    >
      <Calculator config={config} />
    </FigureWrapper>
  ) : (
    <></>
  )
}
export default CalculatorFigure
