import FigureWrapper from '@components/content/figureWrapper/FigureWrapper'
import CustomerDetails from '@components/content/figures/customerDetails/CustomerDetails'
import { FiguresEnum } from '@lib/constants/figures.constants'
import { useConfigWithType } from '@lib/hooks/useConfigWithType'
import { useHideBackToConfig } from '@lib/hooks/useHideBackToConfig'
import { useSetConfig } from '@lib/hooks/useSetConfig'
import { ContentRoutesList } from '@lib/routes/routes.enum'

const CustomerDetailsFigure = () => {
  const config = useConfigWithType(FiguresEnum.customerDetails)
  useSetConfig()
  const isHide = useHideBackToConfig()

  return config ? (
    <FigureWrapper
      backLink={ContentRoutesList.customerDetailSetting.path}
      isHide={isHide}
      backgroundColor={config?.backgroundConfig.backgroundColor || '#fff'}
    >
      <CustomerDetails config={config} />
    </FigureWrapper>
  ) : (
    <></>
  )
}
export default CustomerDetailsFigure
