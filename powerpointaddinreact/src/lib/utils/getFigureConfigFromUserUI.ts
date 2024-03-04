import { getChangedFigure } from '@lib/api/getChangedOnUserUiFigure'
import { retrieveShapeName, saveConfigToOfficeSettings, validateShapeName } from './addin'
import { getFigureType } from './getFigureType'
import { ConfigArray, FiguresConfigTypes } from '@/types/figures/figures.types'

export const getFigureConfigFromUserUI = async () => {
  const shapeName = retrieveShapeName()
  if (!validateShapeName(shapeName)) {
    return null
  }
  const payload = await getChangedFigure(shapeName)
  if (!payload) return null
  const {
    payload: { content_config },
  } = payload

  let figureConfig = JSON.parse(content_config) as FiguresConfigTypes | ConfigArray | null

  if (!figureConfig) return null
  if ('itemConfig' in figureConfig) {
    const figureType = getFigureType(figureConfig.selectedItem)
    figureConfig = figureConfig.itemConfig[figureConfig.selectedItem]
    figureConfig.figureType = figureType
  }
  saveConfigToOfficeSettings(figureConfig)
  return figureConfig
}
