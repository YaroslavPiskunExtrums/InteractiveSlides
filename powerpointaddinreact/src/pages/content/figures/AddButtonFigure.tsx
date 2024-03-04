import FigureWrapper from '@components/content/figureWrapper/FigureWrapper'
import { ContentRoutesList } from '@lib/routes/routes.enum'
import { useSetConfig } from '@lib/hooks/useSetConfig'
import { useHideBackToConfig } from '@lib/hooks/useHideBackToConfig'
import { FiguresEnum } from '@lib/constants/figures.constants'
import { useConfigWithType } from '@lib/hooks/useConfigWithType'
import AddButton from '@components/content/figures/addButton/AddButton'

const AddButtonFigure = () => {
  const config = useConfigWithType(FiguresEnum.addButton)
  useSetConfig()
  const isHide = useHideBackToConfig()

  return config ? (
    <FigureWrapper
      backLink={ContentRoutesList.addButtonSetting.path}
      isHide={isHide}
      backgroundColor={config?.backgroundConfig.backgroundColor || '#fff'}
    >
      <AddButton config={config} />
    </FigureWrapper>
  ) : (
    <></>
  )
}
export default AddButtonFigure
